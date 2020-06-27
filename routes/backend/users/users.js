const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');

const auth = require('../../../middleware/auth');
const authIsAdmin = require('../../../middleware/authIsAdmin');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { User, userResponseTypes } = require('../../../models/User');

const userValidationChecksForAddUser = [
  check('name', userResponseTypes.NAME_REQUIRED).not().isEmpty(),
  check('email', userResponseTypes.EMAIL_INVALID).isEmail(),
  check('password', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User_Password_MinLength')
  }),
  check('role', userResponseTypes.ROLE_REQUIRED).not().isEmpty()
];

const userValidationChecksForUpdateUser = [
  check('name', userResponseTypes.NAME_REQUIRED).not().isEmpty(),
  check('email', userResponseTypes.EMAIL_INVALID).isEmail(),
  check('role', userResponseTypes.ROLE_REQUIRED).not().isEmpty()
];

// @route   GET api/backend/users/users
// @desc    Get all users
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

// @route   GET api/backend/users/users/:_id
// @desc    Get user by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params._id)
      .select('-password')
      .populate('lastModifyUser', 'name');
    if (!user) {
      return res
        .status(404)
        .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });
    }
    res.json(user);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });
  }
});

// @route   POST api/backend/users/users
// @desc    Add user
// @access  Private
router.post(
  '/',
  [authIsAdmin, userValidationChecksForAddUser, validationHandling],
  async (req, res) => {
    const { name, email, password, role, isEnabled } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [userResponseTypes.USER_ALREADY_EXISTS] });
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

// @route   PUT api/backend/users/users/:_id
// @desc    Update user
// @access  Private
router.put(
  '/:_id',
  [authIsAdmin, userValidationChecksForUpdateUser, validationHandling],
  async (req, res) => {
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
      if (!user)
        return res
          .status(404)
          .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });

      // You should set the new option to true to return the document after update was applied.
      // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
      user = await User.findByIdAndUpdate(
        req.params._id,
        { $set: userFields },
        { new: true }
      );

      res.json(user);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// // @route   DELETE api/backend/users/users/:_id
// // @desc    Delete user
// // @access  Private
// router.delete('/:_id', authIsAdmin, async (req, res) => {
//   try {
//     let user = await User.findById(req.params._id);
//     if (!user) return res.status(404).json({ errors: [userResponseTypes.USER_NOT_EXISTS] });

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