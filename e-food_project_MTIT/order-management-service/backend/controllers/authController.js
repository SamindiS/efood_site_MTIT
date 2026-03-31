//const User = require('../models/User');
//middleware to handle async errors automatically
const asyncHandler = require('express-async-handler');

//register new user
//POST api/auth/register
//public access
exports.registerUser = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);
  //extract user inputs user req body
  const { firstName, lastName, contact, email, password } = req.body;

  //using email check user already in the db
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('User already exists: ', email);
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  //create a new user in db
  const user = await User.create({
    firstName,
    lastName,
    contact,
    email,
    password
  });

  console.log('User registered successfully:', user._id);

  //response with user details without password\
  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    contact: user.contact,
    email: user.email
  });
});

//user login
//POST api/auth/login
//public access
exports.loginUser = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);
  //extract email and password from req
  const { email, password } = req.body;

  //using email find the user
  const user = await User.findOne({ email });

  //check user exists and verify the password
  if (user && (await user.comparePassword(password))) {
    //store user ID in session (used for authentication in session-based auth)
    //req.session.userId = user._id;
    req.userId = user._id;

    console.log('User logged successfully');
    //respond with user details without password
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contact: user.contact
    });
  } else {
    console.log('Invalid email or password');
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

//get user by id
//GET api/auth/user/:id
//private access
exports.getUserById = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);

  if (!req.params.id) {
    console.log('Not authorized, no id provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no id provided'
    });
  }

  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    console.log('User not found');
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json(user);
});

// Get all users (admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

//update user by id
//PUT api/auth/user/:id
//private access
exports.updateUserById = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);

  if (!req.params.id) {
    return res.status(400).json({ success: false, message: 'ID required' });
  }

  //find user in db
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  //extract user inputs from req body
  const { firstName, lastName, contact, email, role } = req.body;

  //update user fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (contact) user.contact = contact;
  if (role) user.role = role;

  //only update email if it's different and not already in use
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    user.email = email;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

//delete user by id
//DELETE api/auth/user/:id
//private access
exports.deleteUserById = asyncHandler(async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const User = require('../models/User')(orderDB);

  if (!req.params.id) {
    return res.status(400).json({ success: false, message: 'ID required' });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

//logout user
//POST api/user/logout
//private access
exports.logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});