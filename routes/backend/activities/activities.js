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

    // Build event object
    // Note:
    // non-required fields do not need null check
    const eventFields = {};
    if (label) eventFields.label = label;
    if (name_tc) eventFields.name_tc = name_tc;
    if (name_sc) eventFields.name_sc = name_sc;
    if (name_en) eventFields.name_en = name_en;
    eventFields.descHeadline_tc = descHeadline_tc;
    eventFields.descHeadline_sc = descHeadline_sc;
    eventFields.descHeadline_en = descHeadline_en;
    eventFields.desc_tc = desc_tc;
    eventFields.desc_sc = desc_sc;
    eventFields.desc_en = desc_en;
    eventFields.remarks_tc = remarks_tc;
    eventFields.remarks_sc = remarks_sc;
    eventFields.remarks_en = remarks_en;
    if (isEnabled !== undefined) eventFields.isEnabled = isEnabled;
    eventFields.artDirectors = getArraySafe(artDirectors);
    eventFields.artists = getArraySafe(artists);
    eventFields.shows = sortShows(shows);
    eventFields.scenarists = getArraySafe(scenarists);
    if (venue_tc) eventFields.venue_tc = venue_tc;
    if (venue_sc) eventFields.venue_sc = venue_sc;
    if (venue_en) eventFields.venue_en = venue_en;
    eventFields.prices = getArraySafe(prices);
    eventFields.priceRemarks_tc = priceRemarks_tc;
    eventFields.priceRemarks_sc = priceRemarks_sc;
    eventFields.priceRemarks_en = priceRemarks_en;
    eventFields.phones = getArraySafe(phones);
    eventFields.ticketUrl = ticketUrl;
    eventFields.themeColor = themeColor;
    eventFields.featuredImage = featuredImage;
    eventFields.gallery = getArraySafe(gallery);
    eventFields.lastModifyDT = new Date();
    eventFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const eventId = req.params._id;

    try {
      const oldEvent = await Event.findById(eventId).session(session);
      if (!oldEvent)
        return res
          .status(404)
          .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });

      await removeEventsInvolvedForArtDirectorsAndArtists(oldEvent, session);

      const newEvent = await Event.findByIdAndUpdate(
        eventId,
        { $set: eventFields },
        { session, new: true }
      );

      await setEventsInvolvedForArtDirectorsAndArtists(
        eventId,
        newEvent.artDirectors,
        newEvent.artists,
        session
      );

      await session.commitTransaction();

      res.json(newEvent);
    } catch (err) {
      await session.abortTransaction();
      if (!handleEventLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
