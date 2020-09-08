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
const {
  getArraySafe,
  isNonEmptyArray
} = require('../../../utils/js/array/isNonEmptyArray');
const {
  compareForStringsAscending
} = require('../../../utils/js/string/compareForStrings');
const { compareForDatesAscending } = require('../../../utils/datetime');
const {
  Event,
  eventResponseTypes,
  defaultEventType,
  isValidEventType
} = require('../../../models/Event');
const translateAllFieldsFromTcToSc = require('../../../utils/translate/translateAllFieldsFromTcToSc');
const { Artist } = require('../../../models/Artist');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');

/* utilities */

const eventSelectForFindAll = {
  phasesInvolved: 0
};

const eventSelectForFindOne = { ...eventSelectForFindAll };

const eventSelectForDeleteOne = {
  phasesInvolved: 1,
  artists: 1,
  artDirectors: 1
};

const eventPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'artDirectors',
    select: 'label'
  },
  {
    path: 'artists.artist',
    select: 'label'
  },
  {
    path: 'artists.guestArtistImage',
    select: mediumSelect
  },
  {
    path: 'shows'
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  pageMetaPopulate
];

const eventPopulationListForFindOne = [...eventPopulationListForFindAll];

const eventValidationChecksForCreate = [
  check('label', eventResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', eventResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  //check('name_sc', eventResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', eventResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check(
    'nameForLongDisplay_tc',
    eventResponseTypes.NAME_FOR_LONG_DISPLAY_TC_REQUIRED
  ).notEmpty(),
  // check(
  //   'nameForLongDisplay_sc',
  //   eventResponseTypes.NAME_FOR_LONG_DISPLAY_SC_REQUIRED
  // ).notEmpty(),
  check(
    'nameForLongDisplay_en',
    eventResponseTypes.NAME_FOR_LONG_DISPLAY_EN_REQUIRED
  ).notEmpty(),
  check('type', eventResponseTypes.TYPE_REQUIRED)
  // check('venue_tc', eventResponseTypes.VENUE_TC_REQUIRED).notEmpty(),
  // check('venue_sc', eventResponseTypes.VENUE_SC_REQUIRED).notEmpty(),
  // check('venue_en', eventResponseTypes.VENUE_EN_REQUIRED).notEmpty()
];

const eventValidationChecksForUpdate = [
  ...eventValidationChecksForCreate,
  check('name_sc', eventResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check(
    'nameForLongDisplay_sc',
    eventResponseTypes.NAME_FOR_LONG_DISPLAY_SC_REQUIRED
  ).notEmpty()
  // check('venue_sc', eventResponseTypes.VENUE_SC_REQUIRED).notEmpty()
];

const eventArtDirectorsValidation = artDirectors => {
  for (const artDirector of getArraySafe(artDirectors)) {
    let errorType = null;

    if (!artDirector) {
      errorType = eventResponseTypes.EVENT_ART_DIRECTOR_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }
  return null;
};

const eventArtistsValidation = artists => {
  for (const artist of getArraySafe(artists)) {
    let errorType = null;

    if (artist.isGuestArtist !== true && !artist.artist) {
      errorType = eventResponseTypes.EVENT_ARTIST_REQUIRED;
    } else if (artist.isGuestArtist === true) {
      if (!artist.guestArtistName_tc) {
        errorType = eventResponseTypes.EVENT_GUEST_ARTIST_NAME_TC_REQUIRED;
      } else if (!artist.guestArtistName_sc) {
        errorType = eventResponseTypes.EVENT_GUEST_ARTIST_NAME_SC_REQUIRED;
      } /*else if (!artist.guestArtistName_en) {
        errorType = eventResponseTypes.EVENT_GUEST_ARTIST_NAME_EN_REQUIRED;
      }*/
    } else if (!artist.role_tc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_TC_REQUIRED;
    } else if (!artist.role_sc) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_SC_REQUIRED;
    } /*else if (!artist.role_en) {
      errorType = eventResponseTypes.EVENT_ARTIST_ROLE_EN_REQUIRED;
    }*/

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const eventShowsValidation = shows => {
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

const eventScenaristsValidation = scenarists => {
  for (const scenarist of getArraySafe(scenarists)) {
    let errorType = null;

    if (!scenarist.name_tc) {
      errorType = eventResponseTypes.EVENT_SCENARIST_NAME_TC_REQUIRED;
    } else if (!scenarist.name_sc) {
      errorType = eventResponseTypes.EVENT_SCENARIST_NAME_SC_REQUIRED;
    } /*else if (!scenarist.name_en) {
      errorType = eventResponseTypes.EVENT_SCENARIST_NAME_EN_REQUIRED;
    }*/

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

// const eventPricesValidation = prices => {
//   for (const price of getArraySafe(prices)) {
//     let errorType = null;

//     if (!price.price_tc) {
//       errorType = eventResponseTypes.EVENT_PRICE_PRICE_TC_REQUIRED;
//     } else if (!price.price_sc) {
//       errorType = eventResponseTypes.EVENT_PRICE_PRICE_SC_REQUIRED;
//     } else if (!price.price_en) {
//       errorType = eventResponseTypes.EVENT_PRICE_PRICE_EN_REQUIRED;
//     }

//     if (errorType) {
//       return errorType;
//     }
//   }

//   return null;
// };

// const eventPhonesValidation = phones => {
//   for (const phone of getArraySafe(phones)) {
//     let errorType = null;

//     if (!phone.label_tc) {
//       errorType = eventResponseTypes.EVENT_PHONE_LABEL_TC_REQUIRED;
//     } else if (!phone.label_sc) {
//       errorType = eventResponseTypes.EVENT_PHONE_LABEL_SC_REQUIRED;
//     } else if (!phone.label_en) {
//       errorType = eventResponseTypes.EVENT_PHONE_LABEL_EN_REQUIRED;
//     } else if (!phone.phone) {
//       errorType = eventResponseTypes.EVENT_PHONE_PHONE_REQUIRED;
//     }

//     if (errorType) {
//       return errorType;
//     }
//   }

//   return null;
// };

const handleEventRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const eventRelationshipsValidation = (
  artDirectors,
  artists,
  shows,
  scenarists,
  // prices,
  // phones,
  res
) => {
  let errorType = null;

  errorType = eventArtDirectorsValidation(artDirectors);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = eventArtistsValidation(artists);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = eventShowsValidation(shows);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = eventScenaristsValidation(scenarists);
  if (errorType) {
    handleEventRelationshipsValidationError(errorType, res);
    return false;
  }

  // errorType = eventPricesValidation(prices);
  // if (errorType) {
  //   handleEventRelationshipsValidationError(errorType, res);
  //   return false;
  // }

  // errorType = eventPhonesValidation(phones);
  // if (errorType) {
  //   handleEventRelationshipsValidationError(errorType, res);
  //   return false;
  // }

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
  for (const artist of getArraySafe(artists).filter(
    artist => artist.isGuestArtist !== true
  )) {
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

  for (const artist of getArraySafe(event.artists).filter(
    artist => artist.isGuestArtist !== true
  )) {
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

const getCleanedEventArtists = eventArtists => {
  return getArraySafe(eventArtists).map(eventArtist => ({
    ...eventArtist,
    // since MongoDB does not accept ObjectId to be empty string
    artist: eventArtist.artist === '' ? null : eventArtist.artist
  }));
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

const handleEventLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    eventResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/events/events
// @desc    Get all events
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    // query
    const query = req.query;
    let type = query.type && query.type.toUpperCase();

    if (!isValidEventType(type)) {
      type = defaultEventType;
    }

    const options = {
      ...req.paginationOptions,
      select: eventSelectForFindAll,
      populate: eventPopulationListForFindAll
    };

    let findOptions = {
      type
    };
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      findOptions = {
        ...findOptions,
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
    const event = await Event.findById(req.params._id)
      .select(eventSelectForFindOne)
      .populate(eventPopulationListForFindOne);
    if (!event) {
      return res
        .status(404)
        .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
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
  [auth, eventValidationChecksForCreate, validationHandling],
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
      descHeadline_tc,
      descHeadline_sc,
      descHeadline_en,
      desc_tc,
      desc_sc,
      desc_en,
      remarks_tc,
      remarks_sc,
      remarks_en,
      isEnabled,
      artDirectors,
      artists,
      shows,
      scenarists,
      // venue_tc,
      // venue_sc,
      // venue_en,
      // prices,
      // priceRemarks_tc,
      // priceRemarks_sc,
      // priceRemarks_en,
      // phones,
      // ticketUrl,
      themeColor,
      pageMeta,
      featuredImage,
      gallery
    } = await translateAllFieldsFromTcToSc(req.body);

    // translate "inner" objects
    const artistsTranslated = await Promise.all(
      getArraySafe(artists).map(translateAllFieldsFromTcToSc)
    );

    console.log(artists);
    console.log(artistsTranslated);

    const scenaristsTranslated = await Promise.all(
      getArraySafe(scenarists).map(translateAllFieldsFromTcToSc)
    );

    // const pricesTranslated = await Promise.all(
    //   getArraySafe(prices).map(translateAllFieldsFromTcToSc)
    // );

    // const phonesTranslated = await Promise.all(
    //   getArraySafe(phones).map(translateAllFieldsFromTcToSc)
    // );

    // customed validations
    let isSuccess = eventRelationshipsValidation(
      artDirectors,
      artistsTranslated,
      shows,
      scenaristsTranslated,
      // pricesTranslated,
      // phonesTranslated,
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
        label: label.trim(),
        name_tc,
        name_sc,
        name_en,
        nameForLongDisplay_tc,
        nameForLongDisplay_sc,
        nameForLongDisplay_en,
        type,
        descHeadline_tc,
        descHeadline_sc,
        descHeadline_en,
        desc_tc,
        desc_sc,
        desc_en,
        remarks_tc,
        remarks_sc,
        remarks_en,
        isEnabled,
        lastModifyUser: req.user._id,
        artDirectors: getArraySafe(artDirectors),
        artists: getCleanedEventArtists(artistsTranslated),
        shows: sortShows(shows),
        scenarists: scenaristsTranslated,
        // venue_tc,
        // venue_sc,
        // venue_en,
        // prices: pricesTranslated,
        // priceRemarks_tc,
        // priceRemarks_sc,
        // priceRemarks_en,
        // phones: phonesTranslated,
        // ticketUrl,
        themeColor,
        pageMeta,
        featuredImage,
        gallery: getArraySafe(gallery)
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
  [auth, eventValidationChecksForUpdate, validationHandling],
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
      descHeadline_tc,
      descHeadline_sc,
      descHeadline_en,
      desc_tc,
      desc_sc,
      desc_en,
      remarks_tc,
      remarks_sc,
      remarks_en,
      isEnabled,
      artDirectors,
      artists,
      shows,
      scenarists,
      // venue_tc,
      // venue_sc,
      // venue_en,
      // prices,
      // priceRemarks_tc,
      // priceRemarks_sc,
      // priceRemarks_en,
      // phones,
      // ticketUrl,
      themeColor,
      pageMeta,
      featuredImage,
      gallery
    } = req.body;

    // customed validations
    let isSuccess = eventRelationshipsValidation(
      artDirectors,
      artists,
      shows,
      scenarists,
      // prices,
      // phones,
      res
    );
    if (!isSuccess) {
      return;
    }

    // Build event object
    // Note:
    // non-required fields do not need null check
    const eventFields = {};
    if (label) eventFields.label = label.trim();
    if (name_tc) eventFields.name_tc = name_tc;
    if (name_sc) eventFields.name_sc = name_sc;
    if (name_en) eventFields.name_en = name_en;
    if (nameForLongDisplay_tc)
      eventFields.nameForLongDisplay_tc = nameForLongDisplay_tc;
    if (nameForLongDisplay_sc)
      eventFields.nameForLongDisplay_sc = nameForLongDisplay_sc;
    if (nameForLongDisplay_en)
      eventFields.nameForLongDisplay_en = nameForLongDisplay_en;
    if (type) eventFields.type = type;
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
    eventFields.artists = getCleanedEventArtists(artists);
    eventFields.shows = sortShows(shows);
    eventFields.scenarists = getArraySafe(scenarists);
    // if (venue_tc) eventFields.venue_tc = venue_tc;
    // if (venue_sc) eventFields.venue_sc = venue_sc;
    // if (venue_en) eventFields.venue_en = venue_en;
    // eventFields.prices = getArraySafe(prices);
    // eventFields.priceRemarks_tc = priceRemarks_tc;
    // eventFields.priceRemarks_sc = priceRemarks_sc;
    // eventFields.priceRemarks_en = priceRemarks_en;
    // eventFields.phones = getArraySafe(phones);
    // eventFields.ticketUrl = ticketUrl;
    eventFields.themeColor = themeColor;
    eventFields.pageMeta = pageMeta;
    eventFields.featuredImage = featuredImage;
    eventFields.gallery = getArraySafe(gallery);
    eventFields.lastModifyDT = new Date();
    eventFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const eventId = req.params._id;

    try {
      const oldEvent = await Event.findById(eventId).session(session);
      if (!oldEvent) {
        await session.commitTransaction();
        return res
          .status(404)
          .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
      }

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

// @route   DELETE api/backend/events/events/:_id
// @desc    Delete event
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(req.params._id)
      .select(eventSelectForDeleteOne)
      .session(session);

    if (!event) {
      await session.commitTransaction();
      return res
        .status(404)
        .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
    }

    if (isNonEmptyArray(event.phasesInvolved)) {
      await session.commitTransaction();
      return res
        .status(400)
        .json({ errors: [eventResponseTypes.EVENT_INVOLVED_IN_PHASES] });
    }

    await removeEventsInvolvedForArtDirectorsAndArtists(event, session);
    await Event.findByIdAndDelete(req.params._id, { session });
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
