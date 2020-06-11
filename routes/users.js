const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../middleware/auth');
const authIsAdmin = require('../middleware/authIsAdmin');
const { generalErrorHandle } = require('../utils/errorHandling');
const User = require('../models/User');
const {
  //USER_DELETED,
  NAME_REQUIRED,
  EMAIL_INVALID,
  PASSWORD_INVALID,
  ROLE_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_NOT_EXISTS
} = require('../types/responses/users');

// @route   GET api/users
// @desc    Get all users users
// @access  Private
router.get('/', authIsAdmin, async (req, res) => {
  try {
    // https://mongoosejs.com/docs/populate.html
    const users = await User.find({})
      .select('-password')
      .populate('lastModifyUser', 'name')
      .sort({
        lastModifyDT: -1
      });
    res.json(users);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/users/:_id
// @desc    Get user by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params._id)
      .select('-password')
      .populate('lastModifyUser', 'name');
    if (!user) return res.status(404).json({ type: USER_NOT_EXISTS });
    res.json(user);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res.status(404).json({ type: USER_NOT_EXISTS });
  }
});

// @route   POST api/users
// @desc    Add user
// @access  Private
router.post(
  '/',
  [
    authIsAdmin,
    [
      check('name', NAME_REQUIRED).not().isEmpty(),
      check('email', EMAIL_INVALID).isEmail(),
      check('password', PASSWORD_INVALID).isLength({
        min: 6
      }),
      check('role', ROLE_REQUIRED).not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password, role, isEnabled } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ type: USER_ALREADY_EXISTS });
      }
      user = new User({
        name,
        email,
        password,
        role,
        isEnabled,
        lastModifyUser: req.user._id
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      res.json(user);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   PUT api/users/:_id
// @desc    Update user
// @access  Private
router.put('/:_id', authIsAdmin, async (req, res) => {
  const { name, email, password, role, isEnabled } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (password) userFields.password = password;
  if (role) userFields.role = role;
  if (isEnabled !== undefined) userFields.isEnabled = isEnabled;
  userFields.lastModifyDT = new Date();
  userFields.lastModifyUser = req.user._id;

  try {
    let user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ type: USER_NOT_EXISTS });

    user = await User.findByIdAndUpdate(
      req.params._id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// // @route   DELETE api/users/:_id
// // @desc    Delete user
// // @access  Private
// router.delete('/:_id', authIsAdmin, async (req, res) => {
//   try {
//     let user = await User.findById(req.params._id);
//     if (!user) return res.status(404).json({ type: USER_NOT_EXISTS });

//     const userFields = {
//       isEnabled: false,
//       lastModifyUser: req.user._id
//     };

//     user = await User.findByIdAndUpdate(
//       req.params._id,
//       { $set: userFields },
//       { new: true }
//     );

//     res.json({ type: USER_DELETED });
//   } catch (err) {
//     generalErrorHandle(err, res);
//   }
// });

module.exports = router;
