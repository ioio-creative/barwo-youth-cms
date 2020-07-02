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

const userValidationChecks = [
  check('password', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  }),
  check('password1', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  })
];

// @route   GET api/backend/users/users/editPassword/:_id
// @desc    Update user
// @access  Private
router.put(
  '/:_id',
  [auth, userValidationChecks, validationHandling],
  async (req, res) => {
    const { password, password1 } = req.body;
    console.log(req.body, password, password1);

    // Check Old Password
    const userFields = {};
    if ((userFields.password = await hashPasswordInput(password))) {
      // Change Password
      if (password1) userFields.password = await hashPasswordInput(password1);
      userFields.lastModifyUser = req.user._id;
    } else {
      return res.status(403);
      // .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });
    }

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

module.exports = router;
