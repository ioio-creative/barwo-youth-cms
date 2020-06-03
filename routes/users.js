const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const isAdmin = require('../middleware/isAdmin');
const { generalErrorHandle } = require('../utils/errorHandling');
const User = require('../models/User');
const {
  USER_DELETED,
  NAME_REQUIRED,
  EMAIL_INVALID,
  PASSWORD_INVALID,
  ROLE_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_NOT_EXISTS
} = require('../types/responses/users');

// @route   POST api/users
// @desc    Add user
// @access  Private
router.post(
  '/',
  [
    isAdmin,
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

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ type: USER_ALREADY_EXISTS });
      }
      user = new User({
        name,
        email,
        password,
        role
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   PUT api/users/_:id
// @desc    Update user
// @access  Private
router.put('/:_id', isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (password) userFields.phone = phone;
  if (role) userFields.type = type;
  userFields.lastModifyDT = new Date();

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

// @route   DELETE api/users/:_id
// @desc    Delete user
// @access  Private
router.delete('/:_id', isAdmin, async (req, res) => {
  try {
    let user = await User.findById(req.params._id);
    if (!user || user.deleteDT)
      return res.status(404).json({ type: USER_NOT_EXISTS });

    const userFields = {
      deleteDT: new Date()
    };

    user = await User.findByIdAndUpdate(
      req.params._id,
      { $set: userFields },
      { new: true }
    );

    res.json({ type: USER_DELETED });
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
