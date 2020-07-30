const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Sender, senderResponseTypes } = require('../../../models/Sender');

/* utilities */

const senderSelect = {};

const senderPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const senderValidationChecks = [
  check('emailAddress', senderResponseTypes.EMAILADDRESS_INVALID)
    .notEmpty()
    .isEmail(),
  check('name_tc', senderResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  check('name_sc', senderResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', senderResponseTypes.NAME_EN_REQUIRED).notEmpty()
];

/* end of utilities */

// @route   GET api/backend/sender/sender
// @desc    Get Sender
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sender = await Sender.findOne({})
      .select(senderSelect)
      .populate(senderPopulationList);
    if (!sender) {
      return res.status(404).json({
        errors: [senderResponseTypes.SENDER_NOT_EXISTS]
      });
    }
    res.json(sender);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [senderResponseTypes.SENDER_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/sender/sender
// @desc    Add or update Sender
// @access  Private
router.post(
  '/',
  [auth, senderValidationChecks, validationHandling],
  async (req, res) => {
    const { emailAddress, name_tc, name_sc, name_en } = req.body;

    // Build sender object
    // Note:
    // non-required fields do not need null check
    const senderFields = {};
    senderFields.emailAddress = emailAddress;
    senderFields.name_tc = name_tc;
    senderFields.name_sc = name_sc;
    senderFields.name_en = name_en;

    senderFields.lastModifyDT = new Date();
    senderFields.lastModifyUser = req.user._id;

    try {
      const oldSender = await Sender.findOne({});
      let newSender = null;

      if (oldSender) {
        // update flow
        newSender = await Sender.findOneAndUpdate({}, { $set: senderFields });
      } else {
        // insert flow
        newSender = new Sender(senderFields);

        await newSender.save();
      }

      res.json(newSender);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
