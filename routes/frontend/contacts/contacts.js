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
    const { emailAddress, name, groups = ['EDM'], language } = req.body;
    try {
      const contact = new Contact({
        emailAddress,
        name,
        groups,
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

// @route   POST api/frontend/contacts/unsubscribe
// @desc    Unsubscribe contact by id
// @access  Public // TODO:
router.post('/unsubscribe', async (req, res) => {
  const { _id } = req.body;
  try {
    await Contact.findByIdAndDelete(_id);
    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
