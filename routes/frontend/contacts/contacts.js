const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Contact, contactResponseTypes } = require('../../../models/Contact');

/* utilities */

const constactValidationChecks = [
  check('emailAddress', contactResponseTypes.EMAIL_ADDRESS_REQUIRED)
    .not()
    .isEmpty(),
  check('name', contactResponseTypes.NAME_REQUIRED).not().isEmpty(),
  check('type', contactResponseTypes.TYPE_REQUIRED).not().isEmpty()
];

/* end of utilities */

// @route   POST api/frontend/contacts/contacts
// @desc    Add contact
// @access  Public // TODO:

router.post(
  '/contacts',
  [constactValidationChecks, validationHandling],
  async (req, res) => {
    const { emailAddress, name, type } = req.body;

    try {
      const contact = new Contact({
        emailAddress,
        name,
        type
      });

      await contact.save();

      res.json(contact);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
