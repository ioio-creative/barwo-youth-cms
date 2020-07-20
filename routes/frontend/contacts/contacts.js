const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const validationHandling = require('../../../middleware/validationHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { Contact, contactResponseTypes } = require('../../../models/Contact');

/* utilities */

const constactValidationChecks = [
  check('emailAddress', contactResponseTypes.EMAIL_ADDRESS_INVALID).isEmail(),
  // TODO:
  // check('name', contactResponseTypes.NAME_REQUIRED).notEmpty(),
  // check('type', contactResponseTypes.TYPE_REQUIRED).notEmpty(),
  check('language', contactResponseTypes.LANGUAGE_REQUIRED).notEmpty()
];

const handleContactEmailAddressDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'emailAddress',
    contactResponseTypes.EMAIL_ADDRESS_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   POST api/frontend/contacts/contacts
// @desc    Add contact
// @access  Public // TODO:
router.post(
  '/contacts',
  [constactValidationChecks, validationHandling],
  async (req, res) => {
    const { emailAddress, name, type, language } = req.body;
    try {
      const contact = new Contact({
        emailAddress,
        name,
        type,
        language
      });

      await contact.save();

      res.json(contact);
    } catch (err) {
      if (!handleContactEmailAddressDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;
