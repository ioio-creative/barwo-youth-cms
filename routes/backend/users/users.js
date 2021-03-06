const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const config = require('config');

const auth = require('../../../middleware/auth');
const authIsAdmin = require('../../../middleware/authIsAdmin');
const validationHandling = require('../../../middleware/validationHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { User, userResponseTypes } = require('../../../models/User');
const hashPasswordInput = require('../../../utils/password/hashPasswordInput');

/* utilites */

const userSelectForFindAll = {
  password: 0
};

const userSelectForFindOne = { ...userSelectForFindAll };

const userPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const userPopulationListForFindOne = [...userPopulationListForFindAll];

const userValidationChecksForAddUser = [
  check('name', userResponseTypes.NAME_REQUIRED).notEmpty(),
  check('email', userResponseTypes.EMAIL_INVALID).isEmail().notEmpty(),
  check('password', userResponseTypes.PASSWORD_INVALID).isLength({
    min: config.get('User.password.minLength')
  }),
  check('role', userResponseTypes.ROLE_REQUIRED).notEmpty()
];

const userValidationChecksForUpdateUser = [
  check('name', userResponseTypes.NAME_REQUIRED).notEmpty(),
  check('email', userResponseTypes.EMAIL_INVALID).isEmail().notEmpty(),
  check('role', userResponseTypes.ROLE_REQUIRED).notEmpty()
];

const handleUserNameDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'name',
    userResponseTypes.NAME_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

const handleUserEmailDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'email',
    userResponseTypes.EMAIL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

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

/* end of utilites */

// @route   GET api/backend/users/users
// @desc    Get all users
// @access  Private
router.get('/', authIsAdmin, async (req, res) => {
  try {
    // https://mongoosejs.com/docs/populate.html
    const users = await User.find({})
      .select(userSelectForFindAll)
      .populate(userPopulationListForFindAll)
      .sort({
        name: 1
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
      .select(userSelectForFindOne)
      .populate(userPopulationListForFindOne);
    if (!user) {
      return res
        .status(404)
        .json({ errors: [userResponseTypes.USER_NOT_EXISTS] });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
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
      // check duplicate key error instead of using User.findOne first

      // let user = await User.findOne({ email });
      // if (user) {
      //   return res
      //     .status(400)
      //     .json({ errors: [userResponseTypes.USER_ALREADY_EXISTS] });
      // }

      let user = new User({
        name,
        email,
        password,
        role,
        isEnabled,
        lastModifyUser: req.user._id
      });
      user.password = await hashPasswordInput(password);

      await user.save();

      res.json(user);
    } catch (err) {
      if (!handleUserNameAndEmailDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
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
    if (password) userFields.password = await hashPasswordInput(password);
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
      if (!handleUserNameAndEmailDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;
