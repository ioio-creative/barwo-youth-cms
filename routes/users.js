const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../middleware/auth');
const User = require('../models/User');
const {
  USER_DELETED,
  NAME_REQUIRED,
  EMAIL_INVALID,
  PASSWORD_INVALID,
  ROLE_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_NOT_EXISTS,
  NOT_AUTHORIZED,
  SERVER_ERROR
} = require('../responseTypes/users');
const { ADMIN } = require('../types/userRoles');

// @route   POST api/users
// @desc    Add user
// @access  Private
router.post(
  '/',
  [
    auth,
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
      // Make sure user's role is ADMIN
      if (req.user.role !== ADMIN) {
        return res.status(401).json({ msg: NOT_AUTHORIZED });
      }

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
      console.error(err.message);
      res.status(500).send(SERVER_ERROR);
    }
  }
);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (password) userFields.phone = phone;
  if (role) userFields.type = type;
  userFields.lastModifyDT = new Date();

  try {
    // Make sure user's role is ADMIN
    if (req.user.role !== ADMIN) {
      return res.status(401).json({ type: NOT_AUTHORIZED });
    }

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ type: USER_NOT_EXISTS });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(SERVER_ERROR);
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Make sure user's role is ADMIN
    if (req.user.role !== ADMIN) {
      return res.status(401).json({ type: NOT_AUTHORIZED });
    }

    let user = await User.findById(req.params.id);
    if (!user || user.deleteDT)
      return res.status(404).json({ type: USER_NOT_EXISTS });

    const userFields = {
      deleteDT: new Date()
    };

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json({ type: USER_DELETED });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(SERVER_ERROR);
  }
});

module.exports = router;
