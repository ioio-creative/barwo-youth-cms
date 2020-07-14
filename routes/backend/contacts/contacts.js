const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { Contact, contactResponseTypes } = require('../../../models/Contact');

/* utilities */

const contactSelectForFindAll = {
  // eventsDirected: 0,
  // eventsPerformed: 0
};

const contactSelectForFindOne = { ...contactSelectForFindAll };

const contactPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const contactPopulationListForFindOne = [...contactPopulationListForFindAll];

const contactValidationChecks = [
  check('emailAddress', contactResponseTypes.EMAIL_ADDRESS_REQUIRED).isEmail(),
  check('name', contactResponseTypes.NAME_REQUIRED).not().isEmpty(),
  check('type', contactResponseTypes.TYPE_REQUIRED).not().isEmpty(),
  check('language', contactResponseTypes.LANGUAGE_REQUIRED).not().isEmpty()
];

const handleContactLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'emailAdress',
    contactResponseTypes.EMAIL_ADDRESS_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: contactSelectForFindAll,
      populate: contactPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        ...findOptions,
        $or: [{ emailAddress: filterTextRegex }, { name: filterTextRegex }]
      };
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const contacts = await Contact.paginate(findOptions, options);
    res.json(contacts);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/contact/contact/:_id
// @desc    Get contact by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params._id)
      .select(contactSelectForFindOne)
      .populate(contactPopulationListForFindOne);
    if (!contact) {
      return res
        .status(404)
        .json({ errors: [contactResponseTypes.CONTACT_NOT_EXISTS] });
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [contactResponseTypes.CONTACT_NOT_EXISTS] });
  }
});

// @route   POST api/backend/contacts/contacts
// @desc    Add contact
// @access  Private
router.post(
  '/',
  [auth, contactValidationChecks, validationHandling],
  async (req, res) => {
    const { emailAddress, name, type, isEnabled } = req.body;
    console.log(req.body);

    try {
      const contact = new Contact({
        emailAddress,
        name,
        type,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await contact.save();

      res.json(contact);
    } catch (err) {
      if (!handleContactLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/contacts/contacts/:_id
// @desc    Update contact
// @access  Private
router.put(
  '/:_id',
  [auth, contactValidationChecks, validationHandling],
  async (req, res) => {
    const { emailAddress, name, type, isEnabled } = req.body;

    // Build contact object
    // Note:
    // non-required fields do not need null check
    const contactFields = {};
    if (emailAddress) contactFields.emailAddress = emailAddress;
    if (name) contactFields.name = name;
    contactFields.type = type;
    if (isEnabled !== undefined) contactFields.isEnabled = isEnabled;
    contactFields.lastModifyDT = new Date();
    contactFields.lastModifyUser = req.user._id;

    try {
      let contact = await Contact.findById(req.params._id);
      if (!contact)
        return res
          .status(404)
          .json({ errors: [contactResponseTypes.CONTACT_NOT_EXISTS] });

      contact = await Contact.findByIdAndUpdate(
        req.params._id,
        { $set: contactFields },
        { new: true }
      );

      res.json(contact);
    } catch (err) {
      if (!handleContactLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;

module.exports.handleContactLabelDuplicateKeyError = handleContactLabelDuplicateKeyError;
