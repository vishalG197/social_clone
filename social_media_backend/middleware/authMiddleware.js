const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent as "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const decodedToken = jwt.verify(token,process.env.secretKey); // Replace with your actual secret key
    if (!decodedToken) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
// console.log(user);
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

module.exports = authMiddleware;
