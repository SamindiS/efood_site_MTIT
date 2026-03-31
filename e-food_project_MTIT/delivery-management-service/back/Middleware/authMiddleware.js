import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Driver from '../models/driverModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find driver by ID from token, exclude password
      req.driver = await Driver.findById(decoded.id).select('-password');

      // Also set user in request for compatibility with both middleware versions
      req.user = {
        _id: decoded.id
      };

      if (!req.driver) {
        res.status(401);
        throw new Error('Not authorized, driver not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export default { protect };