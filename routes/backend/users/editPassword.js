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
  check('oldPassword', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  }),
  check('newPassword', userResponseTypes.PASSWORD_INVALID).isLength({
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
    const { oldPassword, newPassword } = req.body;

    try {
      let user = await User.findById(req.params._id);
      if (!user)
        return res
          .status(404)
          .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });

      const userFields = {};

      console.log(user.password);
      console.log(await hashPasswordInput(oldPassword));

      console.log(oldPassword);

      // Check Old Password
      if (user.password === (await hashPasswordInput(oldPassword))) {
        // Change Password
        userFields.password = await hashPasswordInput(newPassword);
        userFields.lastModifyUser = req.user._id;
      } else {
        return res.status(403).json({
          errors: [userResponseTypes.PASSWORD_CHANGE_OLD_PASSWORD_INVALID]
        });
      }

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

module.exports = router;
