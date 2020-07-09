const mongoose = require('mongoose');
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
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { Activity, activityResponseTypes } = require('../../../models/Activity');

/* utilities */

const activitySelectForFindAll = {};

const activitySelectForFindOne = { ...activitySelectForFindAll };

const activiyPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  },
  {
    path: 'gallery',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  }
];

const activityValidationChecks = [
  check('label', activityResponseTypes.LABEL_REQUIRED).not().isEmpty(),
  check('name_tc', activityResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', activityResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', activityResponseTypes.NAME_EN_REQUIRED).not().isEmpty()
];

const handleActivityLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    activityResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/activities/activities
// @desc    Get all activities
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: activitySelectForFindAll,
      populate: activityPopulationListForFindAll
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

    const activities = await Activity.paginate(findOptions, options);
    res.json(activities);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/activities/activities/:_id
// @desc    Get activity by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params._id)
      .select(activitySelectForFindOne)
      .populate(activityPopulationListForFindOne);
    if (!activity) {
      return res
        .status(404)
        .json({ errors: [activityResponseTypes.ACTIVITY_NOT_EXISTS] });
    }
    res.json(activity);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [activityResponseTypes.ACTIVITY_NOT_EXISTS] });
  }
});

// @route   POST api/backend/activities/activities
// @desc    Add activity
// @access  Private
router.post(
  '/',
  [auth, activityValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      fromDate,
      toDate,
      location,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      gallery,
      isEnabled
    } = req.body;

    try {
      const activity = new Activity({
        label,
        name_tc,
        name_sc,
        name_en,
        fromDate,
        toDate,
        location,
        desc_tc,
        desc_sc,
        desc_en,
        featuredImage,
        gallery: getArraySafe(gallery),
        isEnabled,
        lastModifyUser: req.user._id
      });

      await activity.save();

      res.json(activity);
    } catch (err) {
      if (!handleActivityLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/activities/activities/:_id
// @desc    Update activity
// @access  Private
router.put(
  '/:_id',
  [auth, activityValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      fromDate,
      toDate,
      location,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      gallery,
      isEnabled
    } = req.body;

    // Build activity object
    // Note:
    // non-required fields do not need null check
    const activityFields = {};
    if (label) activityFields.label = label;
    if (name_tc) activityFields.name_tc = name_tc;
    if (name_sc) activityFields.name_sc = name_sc;
    if (name_en) activityFields.name_en = name_en;
    activityFields.fromDate = fromDate;
    activityFields.toDate = toDate;
    activityFields.location = location;
    activityFields.desc_tc = desc_tc;
    activityFields.desc_sc = desc_sc;
    activityFields.desc_en = desc_en;
    activityFields.featuredImage = featuredImage;
    activityFields.gallery = getArraySafe(gallery);
    if (isEnabled !== undefined) activityFields.isEnabled = isEnabled;
    activityFields.lastModifyDT = new Date();
    activityFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const activityId = req.params._id;

    try {
      const oldActivity = await ActivityfindById(activityId).session(session);
      if (!oldActivity)
        return res
          .status(404)
          .json({ errors: [activityResponseTypes.ACTIVITY_NOT_EXISTS] });

      const newActivity = await Activity.findByIdAndUpdate(
        activityId,
        { $set: activityFields },
        { session, new: true }
      );

      await session.commitTransaction();

      res.json(newActivity);
    } catch (err) {
      await session.abortTransaction();
      if (!handleActivityLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
