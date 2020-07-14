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
const {
  Newsletter,
  newsletterResponseTypes
} = require('../../../models/Newsletter');

/* utilities */

const newsletterSelectForFindAll = {
  // eventsDirected: 0,
  // eventsPerformed: 0
};

const newsletterSelectForFindOne = { ...newsletterSelectForFindAll };

const newsletterPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const newsletterPopulationListForFindOne = [
  ...newsletterPopulationListForFindAll
];

const newsletterValidationChecks = [
  check('title_tc', newsletterResponseTypes.TITLE_TC_REQUIRED).notEmpty(),
  check('title_sc', newsletterResponseTypes.TITLE_SC_REQUIRED).notEmpty(),
  check('title_en', newsletterResponseTypes.TITLE_EN_REQUIRED).notEmpty(),
  check('message_tc', newsletterResponseTypes.MESSAGE_TC_REQUIRED).notEmpty(),
  check('message_sc', newsletterResponseTypes.MESSAGE_SC_REQUIRED).notEmpty(),
  check('message_en', newsletterResponseTypes.MESSAGE_EN_REQUIRED).notEmpty()
];

const handleNewsletterLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    newsletterResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: newsletterSelectForFindAll,
      populate: newsletterPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        ...findOptions,
        $or: [{ label: filterTextRegex }, { name: filterTextRegex }]
      };
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const newsletters = await Newsletter.paginate(findOptions, options);
    res.json(newsletters);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/newsletter/newsletter/:_id
// @desc    Get newsletter by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params._id)
      .select(newsletterSelectForFindOne)
      .populate(newsletterPopulationListForFindOne);
    if (!newsletter) {
      return res
        .status(404)
        .json({ errors: [newsletterResponseTypes.NEWSLETTER_NOT_EXISTS] });
    }
    res.json(newsletter);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [newsletterResponseTypes.NEWSLETTER_NOT_EXISTS] });
  }
});

// @route   POST api/backend/newsletters/newsletters
// @desc    Add newsletter
// @access  Private
router.post(
  '/',
  [auth, newsletterValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      isEnabled
    } = req.body;
    console.log(req.body);

    try {
      const newsletter = new Newsletter({
        label,
        title_tc,
        title_sc,
        title_en,
        message_tc,
        message_sc,
        message_en,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await newsletter.save();

      res.json(newsletter);
    } catch (err) {
      if (!handleNewsletterLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/newsletters/newsletters/:_id
// @desc    Update newsletter
// @access  Private
router.put(
  '/:_id',
  [auth, newsletterValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      isEnabled
    } = req.body;

    // Build newsletter object
    // Note:
    // non-required fields do not need null check
    const newsletterFields = {};
    if (label) newsletterFields.label = label;
    if (title_tc) newsletterFields.title_tc = title_tc;
    if (title_sc) newsletterFields.title_sc = title_sc;
    if (title_en) newsletterFields.title_en = title_en;
    if (message_tc) newsletterFields.message_tc = message_tc;
    if (message_sc) newsletterFields.message_sc = message_sc;
    if (message_en) newsletterFields.message_en = message_en;
    if (isEnabled !== undefined) newsletterFields.isEnabled = isEnabled;
    newsletterFields.lastModifyDT = new Date();
    newsletterFields.lastModifyUser = req.user._id;

    try {
      let newsletter = await Newsletter.findById(req.params._id);
      if (!newsletter)
        return res
          .status(404)
          .json({ errors: [newsletterResponseTypes.NEWSLETTER_NOT_EXISTS] });

      newsletter = await Newsletter.findByIdAndUpdate(
        req.params._id,
        { $set: newsletterFields },
        { new: true }
      );

      res.json(newsletter);
    } catch (err) {
      if (!handleNewsletterLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;

module.exports.handleNewsletterLabelDuplicateKeyError = handleNewsletterLabelDuplicateKeyError;
