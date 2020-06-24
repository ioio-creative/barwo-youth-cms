const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const validationHandling = require('../middleware/validationHandling');
const listPathHandling = require('../middleware/listingPathHandling');
const { generalErrorHandle } = require('../utils/errorHandling');
const getFindLikeTextRegex = require('../utils/regex/getFindLikeTextRegex');
const { isNonEmptyArray } = require('../utils/js/array/isNonEmptyArray');
const { Event, eventResponseTypes } = require('../models/Event');

const eventValidationChecks = [
  check('name_tc', eventResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', eventResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', eventResponseTypes.NAME_EN_REQUIRED).not().isEmpty()
];

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const paginationOptions = req.paginationOptions;

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
    const events = await Event.paginate(findOptions, paginationOptions);
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
    const event = await Event.findById(req.params._id).populate(
      'lastModifyUser',
      'name'
    );
    if (!event) {
      return res
        .status(404)
        .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
    }
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

    // Build event object
    const eventFields = {};
    if (name_tc) eventFields.name_tc = name_tc;
    if (name_sc) eventFields.name_sc = name_sc;
    if (name_en) eventFields.name_en = name_en;
    if (desc_tc) eventFields.desc_tc = desc_tc;
    if (desc_sc) eventFields.desc_sc = desc_sc;
    if (desc_en) eventFields.desc_en = desc_en;
    if (remarks_tc) eventFields.remarks_tc = remarks_tc;
    if (remarks_sc) eventFields.remarks_sc = remarks_sc;
    if (remarks_en) eventFields.remarks_en = remarks_en;
    if (writer_tc) eventFields.writer_tc = writer_tc;
    if (writer_sc) eventFields.writer_sc = writer_sc;
    if (writer_en) eventFields.writer_en = writer_en;
    if (isEnabled !== undefined) eventFields.isEnabled = isEnabled;
    if (isNonEmptyArray(artDirectors)) eventFields.artists = artists;
    if (isNonEmptyArray(artists)) eventFields.artists = artists;
    eventFields.lastModifyDT = new Date();
    eventFields.lastModifyUser = req.user._id;

    try {
      let event = await Event.findById(req.params._id);
      if (!event)
        return res
          .status(404)
          .json({ errors: [eventeventResponseTypes.EVENT_NOT_EXISTS] });

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
