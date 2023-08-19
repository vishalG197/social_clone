const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');

const router = express.Router();

// Create a new post
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new Post({
      author: req.user._id, 
      content,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
});

// Edit a post
router.put('/:postId/edit', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
console.log(post.author.toString() ,req.user._id.toString())
    if (post.author.toString() != req.user._id) {
      return res.status(403).json({ message: 'Unauthorized to edit this post' });
    }

    post.content = content;
    await post.save();
    res.status(200).json({ message: 'Post edited successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Delete a post
router.delete('/:postId/delete', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
// console.log(req.user._id,post.author.toString())
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

   const deletedNote = await Post.findOneAndDelete({ _id:postId, author: req.user._id })
    if (!deletedNote) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Like a post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();
     
    res.status(200).json({ message: 'Post liked successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Comment on a post
router.post('/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      content,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
