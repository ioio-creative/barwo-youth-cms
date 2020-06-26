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
const {
  compareForStringsAscending
} = require('../../../utils/js/string/compareForStrings');
const { compareForDatesAscending } = require('../../../utils/datetime');
const { Event, eventResponseTypes } = require('../../../models/Event');
const { Artist } = require('../../../models/Artist');

/* utilities */

const eventPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'artDirectors',
    select: 'name_tc'
  },
  {
    path: 'artists.artist',
    select: 'name_tc'
  },
  {
    path: 'shows'
  }
];

const eventPopulationListForFindOne = [...eventPopulationListForFindAll];

const eventValidationChecks = [
  check('label', eventResponseTypes.LABEL_REQUIRED).not().isEmpty(),
  check('name_tc', eventResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', eventResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', eventResponseTypes.NAME_EN_REQUIRED).not().isEmpty()
];

const eventArtDirectorsValidation = (artDirectors, res) => {
  for (const artDirector of getArraySafe(artDirectors)) {
    if (!artDirector) {
      return eventResponseTypes.EVENT_ART_DIRECTOR_REQUIRED;
    }
  }
  return null;
};

const eventArtistsValidation = (artists, res) => {
  for (const artist of getArraySafe(artists)) {
    let errorType = null;

    if (!artist.artist) {
      errorType = eventResponseTypes.EVENT_ARTIST_REQUIRED;
    } else if (!artist.role_tc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_TC_REQUIRED;
    } else if (!artist.role_sc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_SC_REQUIRED;
    } else if (!artist.role_en) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_EN_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const eventShowsValidation = (shows, res) => {
  for (const show of getArraySafe(shows)) {
    let errorType = null;

    if (!show.date) {
      errorType = eventResponseTypes.EVENT_SHOW_DATE_REQUIRED;
    } else if (!show.startTime) {
      errorType = eventResponseTypes.EVENT_SHOW_START_TIME_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const handleEventRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const eventRelationshipsValidation = (artDirectors, artists, shows, res) => {
  let errorType = null;

  errorType = eventArtDirectorsValidation(artDirectors, res);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = eventArtistsValidation(artists, res);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = eventShowsValidation(shows, res);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
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

const compareShows = (show1, show2) => {
  const compareDateResult = compareForDatesAscending(show1.date, show2.date);
  if (compareDateResult !== 0) {
    return compareDateResult;
  }
  return compareForStringsAscending(show1.startTime, show2.startTime);
};

const sortShows = shows => {
  return getArraySafe(shows).sort(compareShows);
};

const handleEventLabelDuplicateKeyError = (error, res) => {
  console.log(JSON.stringify(error, null, 2));
  const { code, keyPattern } = error;
  const isDuplicateKeyError =
    code === 11000 && keyPattern && Object.keys(keyPattern).includes('label');

  if (isDuplicateKeyError) {
    // bad request
    res.status(400).json({
      errors: [eventResponseTypes.LABEL_ALREADY_EXISTS]
    });
  }

  const isErrorHandled = isDuplicateKeyError;
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/events/events
// @desc    Get all events
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      populate: eventPopulationListForFindAll
    };

    // queries
    const filterText = req.query.filterText;

    let findOptions = {};
    if (!['', null, undefined].includes(filterText)) {
      const filterTextRegex = getFindLikeTextRegex(filterText);
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
      eventPopulationListForFindOne
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
      label,
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
      artists,
      shows
    } = req.body;

    // customed validations
    let isSuccess = eventRelationshipsValidation(
      artDirectors,
      artists,
      shows,
      res
    );
    if (!isSuccess) {
      return;
    }

    // https://stackoverflow.com/questions/51228059/mongo-db-4-0-transactions-with-mongoose-nodejs-express
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const event = new Event({
        label,
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
        artists,
        shows
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
      if (!handleEventLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
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
      label,
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
      artists,
      shows
    } = req.body;

    // customed validations
    let isSuccess = eventRelationshipsValidation(
      artDirectors,
      artists,
      shows,
      res
    );
    if (!isSuccess) {
      return;
    }

    // Build event object
    // Note:
    // non-required fields do not need null check
    const eventFields = {};
    if (label) eventFields.label = label;
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
    eventFields.shows = sortShows(shows);
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
