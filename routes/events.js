const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const validationHandling = require('../middleware/validationHandling');
const listPathHandling = require('../middleware/listingPathHandling');
const { generalErrorHandle } = require('../utils/errorHandling');
const getFindLikeTextRegex = require('../utils/regex/getFindLikeTextRegex');
const { getArraySafe } = require('../utils/js/array/isNonEmptyArray');
const { Event, eventResponseTypes } = require('../models/Event');

const eventPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'artists.artist',
    select: 'name_tc'
  },
  {
    path: 'artDirectors',
    select: 'name_tc'
  }
];

const eventValidationChecks = [
  check('name_tc', eventResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', eventResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', eventResponseTypes.NAME_EN_REQUIRED).not().isEmpty()
];

const eventArtDirectorsValidation = artDirectors => {
  for (const artDirector of getArraySafe(artDirectors)) {
    if (!artDirector) {
      // 400 bad request
      res.status(400).json({
        errors: [eventeventResponseTypes.EVENT_ART_DIRECTOR_REQUIRED]
      });
      return false;
    }
  }

  return true;
};

const eventArtistsValidation = artists => {
  for (const artist of getArraySafe(artists)) {
    let errorType = '';

    if (!artist.artist) {
      // 400 bad request
      errorType = eventeventResponseTypes.EVENT_ARTIST_REQUIRED;
    } else if (!artist.role_tc) {
      errorType = eventeventResponseTypes.EVENT_ARTIST_ROLE_TC_REQUIRED;
    } else if (!artist.role_sc) {
      errorType = eventeventResponseTypes.EVENT_ARTIST_ROLE_SC_REQUIRED;
    } else if (!artist.role_en) {
      errorType = eventeventResponseTypes.EVENT_ARTIST_ROLE_EN_REQUIRED;
    }

    if (errorType) {
      // 400 bad request
      res.status(400).json({ errors: [errorType] });
      return false;
    }
  }

  return true;
};

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      populate: eventPopulationList
    };

    // queries
    const filterText = req.query.filterText;

    let findOptions = {};
    if (!['', null, undefined].includes(filterText)) {
      const filterTextRegex = getFindLikeTextRegex(filterText);
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        // $or: [
        //   { name_tc: filterTextRegex },
        //   { name_sc: filterTextRegex },
        //   { name_en: filterTextRegex },
        //   { desc_tc: filterTextRegex },
        //   { desc_sc: filterTextRegex },
        //   { desc_en: filterTextRegex }
        // ]
      };
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const events = await Event.paginate(findOptions, options);
    res.json(events);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/events/:_id
// @desc    Get event by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    // https://mongoosejs.com/docs/populate.html#populating-multiple-paths
    const event = await Event.findById(req.params._id).populate(
      eventPopulationList
    );
    if (!event) {
      return res
        .status(404)
        .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
    }
    console.log(event);
    res.json(event);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
  }
});

// @route   POST api/events
// @desc    Add event
// @access  Private
router.post(
  '/',
  [auth, eventValidationChecks, validationHandling],
  async (req, res) => {
    const {
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      remarks_tc,
      remarks_sc,
      remarks_en,
      writer_tc,
      writer_sc,
      writer_en,
      isEnabled
    } = req.body;

    try {
      const event = new Event({
        name_tc,
        name_sc,
        name_en,
        desc_tc,
        desc_sc,
        desc_en,
        remarks_tc,
        remarks_sc,
        remarks_en,
        writer_tc,
        writer_sc,
        writer_en,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await event.save();

      res.json(event);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   PUT api/events/:_id
// @desc    Update event
// @access  Private
router.put(
  '/:_id',
  [auth, eventValidationChecks, validationHandling],
  async (req, res) => {
    const {
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      remarks_tc,
      remarks_sc,
      remarks_en,
      writer_tc,
      writer_sc,
      writer_en,
      isEnabled,
      artDirectors,
      artists
    } = req.body;

    // customed validations
    let isSuccess;
    isSuccess = eventArtDirectorsValidation();
    if (!isSuccess) {
      return;
    }
    isSuccess = eventArtistsValidation();
    if (!isSuccess) {
      return;
    }

    // Build event object
    // Note:
    // non-required fields do not need null check
    const eventFields = {};
    if (name_tc) eventFields.name_tc = name_tc;
    if (name_sc) eventFields.name_sc = name_sc;
    if (name_en) eventFields.name_en = name_en;
    eventFields.desc_tc = desc_tc;
    eventFields.desc_sc = desc_sc;
    eventFields.desc_en = desc_en;
    eventFields.remarks_tc = remarks_tc;
    eventFields.remarks_sc = remarks_sc;
    eventFields.remarks_en = remarks_en;
    eventFields.writer_tc = writer_tc;
    eventFields.writer_sc = writer_sc;
    eventFields.writer_en = writer_en;
    if (isEnabled !== undefined) eventFields.isEnabled = isEnabled;
    eventFields.artDirectors = getArraySafe(artDirectors);
    eventFields.artists = getArraySafe(artists);
    eventFields.lastModifyDT = new Date();
    eventFields.lastModifyUser = req.user._id;

    try {
      let event = await Event.findById(req.params._id);
      if (!event)
        return res
          .status(404)
          .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });

      event = await Event.findByIdAndUpdate(
        req.params._id,
        { $set: eventFields },
        { new: true }
      );

      res.json(event);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
