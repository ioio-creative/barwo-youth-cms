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
const translateAllFieldsFromTcToSc = require('../../../utils/translate/translateAllFieldsFromTcToSc');
const { Activity, activityResponseTypes } = require('../../../models/Activity');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');

/* utilities */

const activitySelectForFindAll = {
  isFeaturedInLandingPage: 0
};

const activitySelectForFindOne = { ...activitySelectForFindAll };

const activitySelectForDeleteOne = {
  isFeaturedInLandingPage: 1
};

const activityPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  // {
  //   path: 'downloadMedium',
  //   select: mediumSelect
  // }
  pageMetaPopulate
];

const activityPopulationListForFindOne = [...activityPopulationListForFindAll];

const activityValidationChecksForCreate = [
  check('label', activityResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', activityResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  //check('name_sc', activityResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', activityResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check(
    'nameForLongDisplay_tc',
    activityResponseTypes.NAME_FOR_LONG_DISPLAY_TC_REQUIRED
  ).notEmpty(),
  // check(
  //   'nameForLongDisplay_sc',
  //   activityResponseTypes.NAME_FOR_LONG_DISPLAY_SC_REQUIRED
  // ).notEmpty(),
  check(
    'nameForLongDisplay_en',
    activityResponseTypes.NAME_FOR_LONG_DISPLAY_EN_REQUIRED
  ).notEmpty(),
  check('type', activityResponseTypes.TYPE_REQUIRED).notEmpty(),
  check('fromDate', activityResponseTypes.FROM_DATE_REQUIRED).notEmpty()
];

const activityValidationChecksForUpdate = [
  ...activityValidationChecksForCreate,
  check('name_sc', activityResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check(
    'nameForLongDisplay_sc',
    activityResponseTypes.NAME_FOR_LONG_DISPLAY_SC_REQUIRED
  ).notEmpty()
];

const activityVideoLinkValidation = videoLinks => {
  for (const videoLink of getArraySafe(videoLinks)) {
    let errorType = null;

    if (!videoLink) {
      errorType = activityResponseTypes.VIDEO_LINK_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const handleActivityRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const activityRelationshipsValidation = (videoLinks, res) => {
  let errorType = null;

  errorType = activityVideoLinkValidation(videoLinks);
  if (errorType) {
    handleActivityRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

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
router.get('/', [auth, listingHandling], async (req, res) => {
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
        ...findOptions,
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
    console.error(err);
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
  [auth, activityValidationChecksForCreate, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      nameForLongDisplay_tc,
      nameForLongDisplay_sc,
      nameForLongDisplay_en,
      type,
      fromDate,
      toDate,
      location_tc,
      location_sc,
      location_en,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      gallery,
      videoLinks,
      // downloadName_tc,
      // downloadName_sc,
      // downloadName_en,
      // downloadType,
      // downloadUrl_tc,
      // downloadUrl_sc,
      // downloadUrl_en,
      // downloadMedium,
      pageMeta,
      isEnabled
    } = await translateAllFieldsFromTcToSc(req.body);

    // transtate "inner" objects
    const pageMetaTranslated = await translateAllFieldsFromTcToSc(pageMeta);

    // customed validations
    let isSuccess = activityRelationshipsValidation(videoLinks, res);
    if (!isSuccess) {
      return;
    }

    try {
      const activity = new Activity({
        label: label.toString().replace(/[\s\/]/g, '-').trim(),
        name_tc,
        name_sc,
        name_en,
        nameForLongDisplay_tc,
        nameForLongDisplay_sc,
        nameForLongDisplay_en,
        type,
        fromDate,
        toDate,
        location_tc,
        location_sc,
        location_en,
        desc_tc,
        desc_sc,
        desc_en,
        featuredImage,
        gallery: getArraySafe(gallery),
        videoLinks: getArraySafe(videoLinks),
        // downloadName_tc,
        // downloadName_sc,
        // downloadName_en,
        // downloadType,
        // downloadUrl_tc,
        // downloadUrl_sc,
        // downloadUrl_en,
        // downloadMedium,
        pageMeta: pageMetaTranslated,
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
  [auth, activityValidationChecksForUpdate, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      nameForLongDisplay_tc,
      nameForLongDisplay_sc,
      nameForLongDisplay_en,
      type,
      fromDate,
      toDate,
      location_tc,
      location_sc,
      location_en,
      desc_tc,
      desc_sc,
      desc_en,
      featuredImage,
      gallery,
      videoLinks,
      // downloadName_tc,
      // downloadName_sc,
      // downloadName_en,
      // downloadType,
      // downloadUrl_tc,
      // downloadUrl_sc,
      // downloadUrl_en,
      // downloadMedium,
      pageMeta,
      isEnabled
    } = req.body;

    // customed validations
    let isSuccess = activityRelationshipsValidation(videoLinks, res);
    if (!isSuccess) {
      return;
    }

    // Build activity object
    // Note:
    // non-required fields do not need null check
    const activityFields = {};
    if (label) activityFields.label = label.toString().replace(/[\s\/]/g, '-').trim();
    if (name_tc) activityFields.name_tc = name_tc;
    if (name_sc) activityFields.name_sc = name_sc;
    if (name_en) activityFields.name_en = name_en;
    if (nameForLongDisplay_tc)
      activityFields.nameForLongDisplay_tc = nameForLongDisplay_tc;
    if (nameForLongDisplay_sc)
      activityFields.nameForLongDisplay_sc = nameForLongDisplay_sc;
    if (nameForLongDisplay_en)
      activityFields.nameForLongDisplay_en = nameForLongDisplay_en;
    if (type) activityFields.type = type;
    if (fromDate) activityFields.fromDate = fromDate;
    activityFields.toDate = toDate;
    activityFields.location_tc = location_tc;
    activityFields.location_sc = location_sc;
    activityFields.location_en = location_en;
    activityFields.desc_tc = desc_tc;
    activityFields.desc_sc = desc_sc;
    activityFields.desc_en = desc_en;
    activityFields.featuredImage = featuredImage;
    activityFields.gallery = getArraySafe(gallery);
    activityFields.videoLinks = getArraySafe(videoLinks);
    // activityFields.downloadName_tc = downloadName_tc;
    // activityFields.downloadName_sc = downloadName_sc;
    // activityFields.downloadName_en = downloadName_en;
    // activityFields.downloadType = downloadType;
    // activityFields.downloadUrl_tc = downloadUrl_tc;
    // activityFields.downloadUrl_sc = downloadUrl_sc;
    // activityFields.downloadUrl_en = downloadUrl_en;
    // activityFields.downloadMedium = downloadMedium;
    activityFields.pageMeta = pageMeta;
    if (isEnabled !== undefined) activityFields.isEnabled = isEnabled;
    activityFields.lastModifyDT = new Date();
    activityFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const activityId = req.params._id;

    try {
      const oldActivity = await Activity.findById(activityId).session(session);
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

// @route   DELETE api/backend/activities/activities/:_id
// @desc    Delete activity
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  try {
    let activity = await Activity.findById(req.params._id).select(
      activitySelectForDeleteOne
    );

    if (!activity) {
      return res
        .status(404)
        .json({ errors: [activityResponseTypes.ACTIVITY_NOT_EXISTS] });
    }

    /* delete check */

    const deleteCheckFailResponse = errorType => {
      // 400 bad request
      return res.status(400).json({ errors: [errorType] });
    };

    if (activity.isFeaturedInLandingPage) {
      return deleteCheckFailResponse(
        activityResponseTypes.ACTIVITY_FEATURED_IN_LANDING
      );
    }

    /* end of delete check */

    await Activity.findByIdAndDelete(req.params._id);

    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
