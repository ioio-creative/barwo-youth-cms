const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../models/User');
const auth = require('../middleware/auth');
const { generalErrorHandle } = require('../utils/errorHandling');
const { returnValidationResults } = require('../utils/validationHandling');
const {
  INVALID_CREDENTIALS,
  USER_DOES_NOT_HAVE_RIGHT
} = require('../types/responses/auth');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user.isEnabled === false) {
      // 403 forbidden
      return res.status(403).json({ errors: [USER_DOES_NOT_HAVE_RIGHT] });
    }

    res.json(user);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // validation
    const isValidationPassed = returnValidationResults(req, res);
    if (!isValidationPassed) {
      return;
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [INVALID_CREDENTIALS] });
      }
      if (user.isEnabled === false) {
        // 403 forbidden
        return res.status(403).json({ errors: [USER_DOES_NOT_HAVE_RIGHT] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [INVALID_CREDENTIALS] });
      }

      const payload = {
        user: {
          _id: user._id,
          role: user.role
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

module.exports = router;
