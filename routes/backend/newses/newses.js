const mongoose = require('mongoose');
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
const { News, newsResponseTypes } = require('../../../models/News');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const newsSelectForFindAll = {};

const newsSelectForFindOne = { ...newsSelectForFindAll };

const newsPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  {
    path: 'downloadMedium',
    select: mediumSelect
  }
];

const newsPopulationListForFindOne = [...newsPopulationListForFindAll];

const newsValidationChecks = [
  check('label', newsResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', newsResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  check('name_sc', newsResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', newsResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check('type', newsResponseTypes.TYPE_REQUIRED).notEmpty()
];

const handleNewsLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    newsResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/newses/newses
// @desc    Get all newses
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: newsSelectForFindAll,
      populate: newsPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      findOptions = {
        $or: [
          { label: filterTextRegex },
          { name_tc: filterTextRegex },
          { name_sc: filterTextRegex },
          { name_en: filterTextRegex }
        ]
      };
    }

    const newses = await News.paginate(findOptions, options);
    res.json(newses);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/newses/newses/:_id
// @desc    Get news by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params._id)
      .select(newsSelectForFindOne)
      .populate(newsPopulationListForFindOne);
    if (!news) {
      return res
        .status(404)
        .json({ errors: [newsResponseTypes.NEWS_NOT_EXISTS] });
    }
    res.json(news);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [newsResponseTypes.NEWS_NOT_EXISTS] });
  }
});

// @route   POST api/backend/newses/newses
// @desc    Add news
// @access  Private
router.post(
  '/',
  [auth, newsValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      type,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      downloadName_tc,
      downloadName_sc,
      downloadName_en,
      downloadType,
      downloadUrl_tc,
      downloadUrl_sc,
      downloadUrl_en,
      downloadMedium,
      isEnabled
    } = req.body;

    try {
      const news = new News({
        label,
        name_tc,
        name_sc,
        name_en,
        type,
        desc_tc,
        desc_sc,
        desc_en,
        featuredImage,
        downloadName_tc,
        downloadName_sc,
        downloadName_en,
        downloadType,
        downloadUrl_tc,
        downloadUrl_sc,
        downloadUrl_en,
        downloadMedium,
        isEnabled,
        lastModifyUser: req.user._id
      });

      await news.save();

      res.json(news);
    } catch (err) {
      if (!handleNewsLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/newses/newses/:_id
// @desc    Update news
// @access  Private
router.put(
  '/:_id',
  [auth, newsValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      type,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      downloadName_tc,
      downloadName_sc,
      downloadName_en,
      downloadType,
      downloadUrl_tc,
      downloadUrl_sc,
      downloadUrl_en,
      downloadMedium,
      isEnabled
    } = req.body;

    // Build news object
    // Note:
    // non-required fields do not need null check
    const newsFields = {};
    if (label) newsFields.label = label;
    if (name_tc) newsFields.name_tc = name_tc;
    if (name_sc) newsFields.name_sc = name_sc;
    if (name_en) newsFields.name_en = name_en;
    if (type) newsFields.type = type;
    newsFields.desc_tc = desc_tc;
    newsFields.desc_sc = desc_sc;
    newsFields.desc_en = desc_en;
    newsFields.featuredImage = featuredImage;
    newsFields.downloadName_tc = downloadName_tc;
    newsFields.downloadName_sc = downloadName_sc;
    newsFields.downloadName_en = downloadName_en;
    newsFields.downloadType = downloadType;
    newsFields.downloadUrl_tc = downloadUrl_tc;
    newsFields.downloadUrl_sc = downloadUrl_sc;
    newsFields.downloadUrl_en = downloadUrl_en;
    newsFields.downloadMedium = downloadMedium;
    if (isEnabled !== undefined) newsFields.isEnabled = isEnabled;
    newsFields.lastModifyDT = new Date();
    newsFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const newsId = req.params._id;

    try {
      const oldNews = await News.findById(newsId).session(session);
      if (!oldNews)
        return res
          .status(404)
          .json({ errors: [newsResponseTypes.NEWS_NOT_EXISTS] });

      // set order to null if disabled or type changed
      if (isEnabled === false || type !== oldNews.type) {
        newsFields.order = null;
      }

      const newNews = await News.findByIdAndUpdate(
        newsId,
        { $set: newsFields },
        { session, new: true }
      );

      await session.commitTransaction();

      res.json(newNews);
    } catch (err) {
      await session.abortTransaction();
      if (!handleNewsLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   DELETE api/backend/newses/newses/:_id
// @desc    Delete news
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params._id);
    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
