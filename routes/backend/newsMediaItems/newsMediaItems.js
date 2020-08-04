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
const {
  getArraySafe,
  isNonEmptyArray
} = require('../../../utils/js/array/isNonEmptyArray');
const {
  NewsMediaItem,
  newsMediaItemResponseTypes
} = require('../../../models/NewsMediaItem');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const newsMediaItemSelectForFindAll = {};

const newsMediaItemSelectForFindOne = { ...newsMediaItemSelectForFindAll };

const newsMediaItemSelectForDeleteOne = {};

const newsMediaItemPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'thumbnail',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  }
];

const newsMediaItemPopulationListForFindOne = [
  ...newsMediaItemPopulationListForFindAll
];

const newsMediaItemValidationChecks = [
  check('label', newsMediaItemResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', newsMediaItemResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  check('name_sc', newsMediaItemResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', newsMediaItemResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check('fromDate', newsMediaItemResponseTypes.FROM_DATE_REQUIRED).notEmpty()
];

const handleNewsMediaItemLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    newsMediaItemResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/newsMediaItems/newsMediaItems
// @desc    Get all news media items
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: newsMediaItemSelectForFindAll,
      populate: newsMediaItemPopulationListForFindAll
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
          // { desc_tc: filterTextRegex },
          // { desc_sc: filterTextRegex },
          // { desc_en: filterTextRegex }
        ]
      };
    }

    const newsMediaItems = await NewsMediaItem.paginate(findOptions, options);
    res.json(newsMediaItems);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/newsMediaItems/newsMediaItems/:_id
// @desc    Get news media item by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const newsMediaItem = await NewsMediaItem.findById(req.params._id)
      .select(newsMediaItemSelectForFindOne)
      .populate(newsMediaItemPopulationListForFindOne);
    if (!newsMediaItem) {
      return res.status(404).json({
        errors: [newsMediaItemResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS]
      });
    }
    res.json(newsMediaItem);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [newsMediaItemResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/newsMediaItems/newsMediaItems
// @desc    Add news media item
// @access  Private
router.post(
  '/',
  [auth, newsMediaItemValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      fromDate,
      desc_tc,
      desc_sc,
      desc_en,
      thumbnail,
      gallery,
      isEnabled
    } = req.body;

    try {
      const newsMediaItem = new NewsMediaItem({
        label,
        name_tc,
        name_sc,
        name_en,
        fromDate,
        desc_tc,
        desc_sc,
        desc_en,
        thumbnail,
        gallery: getArraySafe(gallery),
        isEnabled,
        lastModifyUser: req.user._id
      });

      await newsMediaItem.save();

      res.json(newsMediaItem);
    } catch (err) {
      if (!handleNewsMediaItemLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/newsMediaItems/newsMediaItems/:_id
// @desc    Update news media item
// @access  Private
router.put(
  '/:_id',
  [auth, newsMediaItemValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      fromDate,
      desc_tc,
      desc_sc,
      desc_en,
      thumbnail,
      gallery,
      isEnabled
    } = req.body;

    // Build news media item object
    // Note:
    // non-required fields do not need null check
    const newsMediaItemFields = {};
    if (label) newsMediaItemFields.label = label;
    if (name_tc) newsMediaItemFields.name_tc = name_tc;
    if (name_sc) newsMediaItemFields.name_sc = name_sc;
    if (name_en) newsMediaItemFields.name_en = name_en;
    if (fromDate) newsMediaItemFields.fromDate = fromDate;
    newsMediaItemFields.desc_tc = desc_tc;
    newsMediaItemFields.desc_sc = desc_sc;
    newsMediaItemFields.desc_en = desc_en;
    newsMediaItemFields.thumbnail = thumbnail;
    newsMediaItemFields.gallery = getArraySafe(gallery);
    if (isEnabled !== undefined) newsMediaItemFields.isEnabled = isEnabled;
    newsMediaItemFields.lastModifyDT = new Date();
    newsMediaItemFields.lastModifyUser = req.user._id;

    const newsMediaItemId = req.params._id;

    try {
      const oldNewsMediaItem = await NewsMediaItem.findById(newsMediaItemId);

      if (!oldNewsMediaItem) {
        return res.status(404).json({
          errors: [newsMediaItemResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS]
        });
      }

      const newNewsMediaItem = await NewsMediaItem.findByIdAndUpdate(
        newsMediaItemId,
        { $set: newsMediaItemFields },
        { new: true }
      );

      res.json(newNewsMediaItem);
    } catch (err) {
      if (!handleNewsMediaItemLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   DELETE api/backend/newsMediaItems/newsMediaItems/:_id
// @desc    Delete news media item
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  try {
    const newsMediaItem = await NewsMediaItem.findById(req.params._id).select(
      newsMediaItemSelectForDeleteOne
    );

    if (!newsMediaItem) {
      return res.status(404).json({
        errors: [newsMediaItemResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS]
      });
    }

    await NewsMediaItem.findByIdAndDelete(req.params._id);

    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
