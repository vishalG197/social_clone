const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// View user profile
router.get('/:userId/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password') // Exclude password field from response
      .populate('followers', 'username') // Populate followers with usernames
      .populate('following', 'username'); // Populate following with usernames
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Follow a user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already being followed
    if (userToFollow.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    req.user.following.push(userToFollow._id);
    await req.user.save();

    res.status(200).json({ message: 'You are now following this user', user: userToFollow });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Unfollow a user
router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is not being followed
    if (!userToUnfollow.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id);
    await userToUnfollow.save();

    req.user.following = req.user.following.filter(id => id.toString() !== userToUnfollow._id.toString());
    await req.user.save();

    res.status(200).json({ message: 'You have unfollowed this user', user: userToUnfollow });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
