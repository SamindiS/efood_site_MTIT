const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
  logoutUser,
  getAllUsers
} = require('../controllers/authController');

//Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

//Admin/User routes
router.get('/users', getAllUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUserById);
router.delete('/user/:id', deleteUserById);
router.post('/logout', logoutUser);

module.exports = router;