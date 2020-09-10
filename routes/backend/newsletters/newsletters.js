const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listingHandling = require('../../../middleware/listingHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const translateAllFieldsFromTcToSc = require('../../../utils/translate/translateAllFieldsFromTcToSc');
const {
  Newsletter,
  newsletterResponseTypes
} = require('../../../models/Newsletter');
const { SendHistory } = require('../../../models/SendHistory');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');

/* utilities */

const newsletterSelectForFindAll = {};

const newsletterSelectForFindOne = { ...newsletterSelectForFindAll };

const newsletterPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  pageMetaPopulate
];

const newsletterPopulationListForFindOne = [
  ...newsletterPopulationListForFindAll
];

const newsletterValidationChecksForCreate = [
  check('label', newsletterResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('fromDate', newsletterResponseTypes.FROM_DATE_REQUIRED).notEmpty(),
  check('title_tc', newsletterResponseTypes.TITLE_TC_REQUIRED).notEmpty(),
  //check('title_sc', newsletterResponseTypes.TITLE_SC_REQUIRED).notEmpty(),
  check('title_en', newsletterResponseTypes.TITLE_EN_REQUIRED).notEmpty(),
  check('message_tc', newsletterResponseTypes.MESSAGE_TC_REQUIRED).notEmpty(),
  //check('message_sc', newsletterResponseTypes.MESSAGE_SC_REQUIRED).notEmpty(),
  check('message_en', newsletterResponseTypes.MESSAGE_EN_REQUIRED).notEmpty()
];

const newsletterValidationChecksForUpdate = [
  ...newsletterValidationChecksForCreate,
  check('title_sc', newsletterResponseTypes.TITLE_SC_REQUIRED).notEmpty(),
  check('message_sc', newsletterResponseTypes.MESSAGE_SC_REQUIRED).notEmpty()
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

// @desc    Get newsletter
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
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
        $or: [
          { label: filterTextRegex },
          { title_tc: filterTextRegex },
          { title_sc: filterTextRegex },
          { title_en: filterTextRegex }
        ]
      };
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const newsletters = await Newsletter.paginate(findOptions, options);
    res.json(newsletters);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

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
    console.error(err);
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
  [auth, newsletterValidationChecksForCreate, validationHandling],
  async (req, res) => {
    const {
      label,
      fromDate,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      featuredImage,
      pageMeta,
      isEnabled
    } = await translateAllFieldsFromTcToSc(req.body);

    // translate "inner" objects
    const pageMetaTranslated = await translateAllFieldsFromTcToSc(pageMeta);

    try {
      const newsletter = new Newsletter({
        label: label.trim(),
        fromDate,
        title_tc,
        title_sc,
        title_en,
        message_tc,
        message_sc,
        message_en,
        featuredImage,
        pageMeta: pageMetaTranslated,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await newsletter.save();

      res.json(newsletter);
      return res.status(200);
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
  [auth, newsletterValidationChecksForUpdate, validationHandling],
  async (req, res) => {
    const {
      label,
      fromDate,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      featuredImage,
      pageMeta,
      isEnabled
    } = req.body;

    // Build newsletter object
    // Note:
    // non-required fields do not need null check
    const newsletterFields = {};
    if (label) newsletterFields.label = label.trim();
    if (fromDate) newsletterFields.fromDate = fromDate;
    if (title_tc) newsletterFields.title_tc = title_tc;
    if (title_sc) newsletterFields.title_sc = title_sc;
    if (title_en) newsletterFields.title_en = title_en;
    if (message_tc) newsletterFields.message_tc = message_tc;
    if (message_sc) newsletterFields.message_sc = message_sc;
    if (message_en) newsletterFields.message_en = message_en;
    newsletterFields.featuredImage = featuredImage;
    newsletterFields.pageMeta = pageMeta;
    if (isEnabled !== undefined) newsletterFields.isEnabled = isEnabled;
    newsletterFields.lastModifyDT = new Date();
    newsletterFields.lastModifyUser = req.user._id;
    // // set order to null if disabled
    // if (isEnabled === false) newsletterFields.order = null;

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

router.delete('/:_id', async (req, res) => {
  try {
    if (await SendHistory.exists({ email: req.params._id })) {
      return res
        .status(400)
        .json({ errors: [newsletterResponseTypes.NEWSLETTER_SENT_BEFORE] });
    }

    await Newsletter.findByIdAndDelete(req.params._id);

    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
