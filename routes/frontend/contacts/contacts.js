const express = require('express');
const router = express.Router();
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Contact, contactResponseTypes } = require('../../../models/Contact');
const languageHandling = require('../../../middleware/languageHandling');
const {
  handleContactLabelDuplicateKeyError
} = require('../../backend/contacts/contacts');

const contactSelectForFindAll = {
  eventsDirected: 0,
  eventsPerformed: 0
};

const contactSelectForFindOne = { ...contactSelectForFindAll };

const contactPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const contactPopulationListForFindOne = [...contactPopulationListForFindAll];

/* end of utilities */

// @route   POST api/frontend/contacts/:lang/contacts
// @desc    Add contact
// @access  Private

router.post('/:lang/contacts', [languageHandling], async (req, res) => {
  const { emailAddress, name, type } = req.body;
  console.log('front end here');
  try {
    const contact = new Contact({
      emailAddress,
      name,
      type
    });
    if (!emailAddress) {
      return res.status(404).json({
        errors: [contactResponseTypes.EMAIL_ADDRESS_REQUIRED]
      });
    }
    if (!name) {
      return res.status(404).json({
        errors: [contactResponseTypes.NAME_REQUIRED]
      });
    }
    if (!type) {
      return res.status(404).json({
        errors: [contactResponseTypes.TYPE_REQUIRED]
      });
    }
    // if (handleContactLabelDuplicateKeyError(err, res)) {
    //   return res.status(404).json({
    //     errors: [contactResponseTypes.EMAIL_ADDRESS_REQUIRED]
    //   });
    // }
    await contact.save();

    res.json(contact);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
