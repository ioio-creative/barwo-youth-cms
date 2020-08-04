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
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  NewsMediaGroup,
  newsMediaGroupResponseTypes
} = require('../../../models/NewsMediaGroup');
const { NewsMediaItem } = require('../../../models/NewsMediaItem');

/* utilities */

const newsMediaGroupSelectForFindAll = {};

const newsMediaGroupSelectForFindOne = { ...newsMediaGroupSelectForFindAll };

const newsMediaGroupDeleteSelectForFindOne = {
  newsMediaItems: 1
};

const newsMediaGroupPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'newsMediaItems',
    select: 'label'
  }
];

const newsMediaGroupPopulationListForFindOne = [
  ...newsMediaGroupPopulationListForFindAll
];

const newsMediaGroupValidationChecks = [
  check('label', newsMediaGroupResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', newsMediaGroupResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  check('name_sc', newsMediaGroupResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', newsMediaGroupResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check('year', newsMediaGroupResponseTypes.YEAR_REQUIRED).notEmpty()
];

const setNewsMediaGroupsInvolvedForNewsMediaItems = async (
  newsMediaGroupId,
  newsMediaItems,
  session
) => {
  const options = { session };

  // set news media item's newsMediaGroupsInvolved
  for (const newsMediaItem of getArraySafe(newsMediaItems)) {
    // newsMediaItem is newsMediaItem's _id
    await NewsMediaItem.findByIdAndUpdate(
      newsMediaItem,
      {
        $addToSet: {
          newsMediaGroupsInvolved: newsMediaGroupId
        }
      },
      options
    );
  }
};

const removeNewsMediaGroupsInvolvedForNewsMediaItems = async (
  newsMediaGroup,
  session
) => {
  const options = { session };

  for (const newsMediaItem of getArraySafe(newsMediaGroup.newsMediaItems)) {
    await NewsMediaItem.findByIdAndUpdate(
      newsMediaItem,
      {
        $pull: {
          newsMediaGroupsInvolved: newsMediaGroup._id
        }
      },
      options
    );
  }
};

const handleNewsMediaGroupYearDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'year',
    newsMediaGroupResponseTypes.YEAR_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/newsMediaGroups/newsMediaGroups
// @desc    Get all news media groups
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: newsMediaGroupSelectForFindAll,
      populate: newsMediaGroupPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      findOptions = {
        $or: [{ derivedLabel: filterTextRegex }]
      };
    }

    const newsMediaGroups = await NewsMediaGroup.paginate(findOptions, options);
    res.json(newsMediaGroups);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/newsMediaGroups/newsMediaGroups/:_id
// @desc    Get news media group by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const newsMediaGroup = await NewsMediaGroup.findById(req.params._id)
      .select(newsMediaGroupSelectForFindOne)
      .populate(newsMediaGroupPopulationListForFindOne);
    if (!newsMediaGroup) {
      return res.status(404).json({
        errors: [newsMediaGroupResponseTypes.NEWS_MEDIA_GROUP_NOT_EXISTS]
      });
    }
    res.json(newsMediaGroup);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [newsMediaGroupResponseTypes.NEWS_MEDIA_GROUP_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/newsMediaGroups/newsMediaGroups
// @desc    Add news media group
// @access  Private
router.post(
  '/',
  [auth, newsMediaGroupValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      year,
      newsMediaItems,
      isEnabled
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newsMediaGroup = new NewsMediaGroup({
        label,
        name_tc,
        name_sc,
        name_en,
        year,
        newsMediaItems,
        isEnabled,
        lastModifyUser: req.user._id
      });

      await NewsMediaGroup.save({ session });

      await setNewsMediaGroupsInvolvedForNewsMediaItems(
        newsMediaGroup._id,
        newsMediaItems,
        session
      );

      await session.commitTransaction();

      res.json(newsMediaGroup);
    } catch (err) {
      await session.abortTransaction();
      if (!handleNewsMediaGroupYearDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   PUT api/backend/newsMediaGroups/newsMediaGroups/:_id
// @desc    Update news media group
// @access  Private
router.put(
  '/:_id',
  [auth, newsMediaGroupValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      year,
      newsMediaItems,
      isEnabled
    } = req.body;

    // Build news media group object
    // Note:
    // non-required fields do not need null check
    const newsMediaGroupFields = {};
    if (label) newsMediaGroupFields.label = label;
    if (name_tc) newsMediaGroupFields.name_tc = name_tc;
    if (name_sc) newsMediaGroupFields.name_sc = name_sc;
    if (name_en) newsMediaGroupFields.name_en = name_en;
    if (year) newsMediaGroupFields.year = year;
    newsMediaGroupFields.newsMediaItems = getArraySafe(newsMediaItems);
    if (isEnabled !== undefined) newsMediaGroupFields.isEnabled = isEnabled;
    newsMediaGroupFields.lastModifyDT = new Date();
    newsMediaGroupFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const newsMediaGroupId = req.params._id;

    try {
      const oldNewsMediaGroup = await NewsMediaGroup.findById(
        newsMediaGroupId
      ).session(session);

      if (!oldNewsMediaGroup)
        return res.status(404).json({
          errors: [newsMediaGroupResponseTypes.NEWS_MEDIA_GROUP_NOT_EXISTS]
        });

      await removeNewsMediaGroupsInvolvedForNewsMediaItems(
        oldNewsMediaGroup,
        session
      );

      const newNewsMediaGroup = await NewsMediaGroup.findByIdAndUpdate(
        newsMediaGroupId,
        { $set: newsMediaGroupFields },
        { session, new: true }
      );

      await setNewsMediaGroupsInvolvedForNewsMediaItems(
        newsMediaGroupId,
        newNewsMediaGroup.newsMediaItems,
        session
      );

      await session.commitTransaction();

      res.json(newNewsMediaGroup);
    } catch (err) {
      await session.abortTransaction();
      if (!handleNewsMediaGroupYearDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   DELETE api/backend/newsMediaGroups/newsMediaGroups/:_id
// @desc    Delete news media group
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newsMediaGroup = await NewsMediaGroup.findById(req.params._id)
      .select(newsMediaGroupDeleteSelectForFindOne)
      .session(session);

    if (!newsMediaGroup) {
      await session.commitTransaction();
      return res.status(404).json({
        errors: [newsMediaGroupResponseTypes.NEWS_MEDIA_GROUP_NOT_EXISTS]
      });
    }

    await removeNewsMediaGroupsInvolvedForNewsMediaItems(
      newsMediaGroup,
      session
    );
    await NewsMediaGroup.findByIdAndDelete(req.params._id, { session });
    await session.commitTransaction();

    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    generalErrorHandle(err, res);
  } finally {
    session.endSession();
  }
});

module.exports = router;
