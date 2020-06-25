const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getFindLikeTextRegex = require('../../../utils/regex/getFindLikeTextRegex');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { Event, eventResponseTypes } = require('../../../models/Event');
const { Artist } = require('../../../models/Artist');

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

const eventArtDirectorsValidation = (artDirectors, res) => {
  for (const artDirector of getArraySafe(artDirectors)) {
    if (!artDirector) {
      // 400 bad request
      res.status(400).json({
        errors: [eventResponseTypes.EVENT_ART_DIRECTOR_REQUIRED]
      });
      return false;
    }
  }

  return true;
};

const eventArtistsValidation = (artists, res) => {
  for (const artist of getArraySafe(artists)) {
    let errorType = '';

    if (!artist.artist) {
      // 400 bad request
      errorType = eventResponseTypes.EVENT_ARTIST_REQUIRED;
    } else if (!artist.role_tc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_TC_REQUIRED;
    } else if (!artist.role_sc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_SC_REQUIRED;
    } else if (!artist.role_en) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_EN_REQUIRED;
    }

    if (errorType) {
      // 400 bad request
      res.status(400).json({ errors: [errorType] });
      return false;
    }
  }

  return true;
};

const setEventsInvolvedForArtDirectorsAndArtists = async (
  eventId,
  artDirectors,
  artists,
  session
) => {
  // https://stackoverflow.com/questions/55264112/mongoose-many-to-many-relations

  const options = { session };

  // set art director's eventsDirected
  for (const artDirector of getArraySafe(artDirectors)) {
    // artDirector is artist's _id
    await Artist.findByIdAndUpdate(
      artDirector,
      {
        $addToSet: {
          eventsDirected: eventId
        }
      },
      options
    );
  }

  // set artist's eventsPerformed
  for (const artist of getArraySafe(artists)) {
    // artist.artist is artist's _id
    await Artist.findByIdAndUpdate(
      artist.artist,
      {
        $addToSet: {
          eventsPerformed: eventId
        }
      },
      options
    );
  }
};

const removeEventsInvolvedForArtDirectorsAndArtists = async (
  event,
  session
) => {
  const options = { session };

  for (const artDirector of getArraySafe(event.artDirectors)) {
    await Artist.findByIdAndUpdate(
      artDirector,
      {
        $pull: {
          eventsDirected: event._id
        }
      },
      options
    );
  }

  for (const artist of getArraySafe(event.artists)) {
    await Artist.findByIdAndUpdate(
      artist.artist,
      {
        $pull: {
          eventsPerformed: event._id
        }
      },
      options
    );
  }
};

// @route   GET api/backend/events/events
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

// @route   GET api/backend/events/events/:_id
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
    res.json(event);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
  }
});

// @route   POST api/backend/events/events
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
      isEnabled,
      artDirectors,
      artists
    } = req.body;

    // customed validations
    let isSuccess;
    isSuccess = eventArtDirectorsValidation(artDirectors, res);
    if (!isSuccess) {
      return;
    }
    isSuccess = eventArtistsValidation(artists, res);
    if (!isSuccess) {
      return;
    }

    // https://stackoverflow.com/questions/51228059/mongo-db-4-0-transactions-with-mongoose-nodejs-express
    const session = await mongoose.startSession();
    session.startTransaction();

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
        lastModifyUser: req.user._id,
        artDirectors,
        artists
      });

      await event.save({ session });

      await setEventsInvolvedForArtDirectorsAndArtists(
        event._id,
        artDirectors,
        artists,
        session
      );

      await session.commitTransaction();

      res.json(event);
    } catch (err) {
      await session.abortTransaction();
      generalErrorHandle(err, res);
    } finally {
      session.endSession();
    }
  }
);

// @route   PUT api/backend/events/events/:_id
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
    isSuccess = eventArtDirectorsValidation(artDirectors, res);
    if (!isSuccess) {
      return;
    }
    isSuccess = eventArtistsValidation(artists, res);
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
      generalErrorHandle(err, res);
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
