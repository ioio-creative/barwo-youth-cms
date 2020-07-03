const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const config = require('config');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { User, userResponseTypes } = require('../../../models/User');
const hashPasswordInput = require('../../../utils/password/hashPasswordInput');

const userValidationChecks = [
  check('password', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  }),
  check('password1', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  })
];

const handleUserNameAndEmailDuplicateKeyError = (err, res) => {
  let isErrorHandled = false;

  isErrorHandled = handleUserEmailDuplicateKeyError(err, res);
  if (isErrorHandled) {
    return true;
  }

  isErrorHandled = handleUserNameDuplicateKeyError(err, res);
  if (isErrorHandled) {
    return true;
  }

  return false;
};

// @route   GET api/backend/users/users/editPassword/:_id
// @desc    Update user
// @access  Private
router.put(
  '/:_id',
  [auth, userValidationChecks, validationHandling],
  async (req, res) => {
    const { password, password1 } = req.body;
    console.log(req.body);

    // Check Old Password
    const userFields = {};
    if (userFields.password === (await hashPasswordInput(password))) {
      // Change Password
      if (password1) userFields.password = await hashPasswordInput(password1);
      userFields.lastModifyUser = req.user._id;
    } else {
      return res.status(403).json({
        errors: [userResponseTypes.PASSWORD_CHANGE_OLD_PASSWORD_INVALID]
      });
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
      // if (userFields.password !== (await hashPasswordInput(password))) {
      //   return res.status(403).json({
      //     errors: [userResponseTypes.PASSWORD_CHANGE_OLD_PASSWORD_INVALID]
      //   });
      // }
    } catch (err) {
      if (!handleUserNameAndEmailDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;
