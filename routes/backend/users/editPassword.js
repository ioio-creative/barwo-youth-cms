const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { User, userResponseTypes } = require('../../../models/User');

const hashPasswordInput = async passwordInput => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(passwordInput, salt);
};

// @route   GET api/backend/users/users/editPassword/:_id
// @desc    Update user
// @access  Private
router.put(
  '/editPassword:_id',
  [auth, userValidationChecksForUpdateUser, validationHandling],
  async (req, res) => {
    const { password } = req.body;

    // Build user object
    const userFields = {};
    if (password) userFields.password = await hashPasswordInput(password);
    userFields.lastModifyUser = req.user._id;

    try {
      let user = await User.findById(req.params._id);
      if (!user)
        return res
          .status(404)
          .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });
      user = await User.findByIdAndUpdate(
        req.params._id,
        { $set: userFields },
        { new: true }
      );

      res.json(user);
    } catch (err) {
      if (!handleUserNameAndEmailDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);
