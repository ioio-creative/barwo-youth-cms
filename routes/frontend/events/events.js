const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  isNonEmptyArray,
  getArraySafe
} = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  Event,
  eventResponseTypes,
  defaultEventType,
  isValidEventType,
  eventTypes
} = require('../../../models/Event');
const { Phase, phaseResponseTypes } = require('../../../models/Phase');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

/* utilities */

const eventThemeColorDefault1 = '#A6C2B6';
const eventThemeColorDefault2 = '#E66A59';

const eventSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const eventSelectForFindOne = {
  ...eventSelectForFindAll
};

// https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
const eventPopulationListForFindAll = [
  {
    path: 'artDirectors',
    select: {
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      featuredImage: 1
    },
    populate: {
      path: 'featuredImage',
      select: {
        url: 1
      }
    }
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  }
];

const eventPopulationListForFindOne = [
  ...eventPopulationListForFindAll,
  {
    path: 'artists.artist',
    select: {
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      featuredImage: 1
    },
    populate: {
      path: 'featuredImage',
      select: {
        url: 1
      }
    }
  },
  {
    path: 'artists.guestArtistImage',
    select: {
      url: 1
    }
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  pageMetaPopulate
];

const eventPopulationListForRelatedEvents = [
  {
    path: 'events',
    select: {
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      shows: 1,
      artDirectors: 1
    },
    populate: [
      {
        path: 'artDirectors',
        select: {
          label: 1,
          name_tc: 1,
          name_sc: 1,
          name_en: 1
        }
      }
    ]
  }
];

const getThemeColorForEvent = (event, index = null) => {
  let themeColor = event.themeColor;
  if (!themeColor) {
    if (index !== null) {
      themeColor =
        index % 2 === 0 ? eventThemeColorDefault1 : eventThemeColorDefault2;
    } else {
      themeColor = eventThemeColorDefault1;
    }
  } else if (themeColor.length === 9 && themeColor.substr(7) === '00') {
    // themeColor = #rrggbbaa
    // transparent case
    themeColor = eventThemeColorDefault1;
  }
  return themeColor;
};

const addThemeColorDefaultToEvent = (event, index) => {
  event.themeColor = getThemeColorForEvent(event, index);
};

// !!!Important!!!
// addThemeColorDefaultToEvents is separate from getEventForFrontEndFromDbEvent
// because at the time when getEventForFrontEndFromDbEvent is called,
// the events in the array may not be in the right order
const addThemeColorDefaultToEvents = events => {
  getArraySafe(events).forEach(addThemeColorDefaultToEvent);
};

const getEventForFrontEndFromDbEvent = (
  dbEvent,
  language,
  isRequireDetail = false,
  defaultPageMeta = {}
) => {
  const event = dbEvent;

  const name = getEntityPropByLanguage(event, 'name', language);

  let nameForLongDisplay = getEntityPropByLanguage(
    event,
    'nameForLongDisplay',
    language
  );
  nameForLongDisplay = nameForLongDisplay
    ? nameForLongDisplay.replace(/\n/g, '<br>')
    : name;

  let firstShowDateRaw = null;
  let firstShowDate = null;
  let firstShowYear = null;
  let firstShowMonth = null;
  let lastShowDateRaw = null;
  let lastShowDate = null;
  // let lastShowYear = null;
  // let lastShowMonth = null;
  if (isNonEmptyArray(event.shows)) {
    const firstShow = event.shows[0];
    firstShowDateRaw = firstShow.date;
    firstShowDate = firstShowDateRaw
      ? formatDateStringForFrontEnd(firstShowDateRaw)
      : null;
    // console.log(firstShowDateRaw);
    firstShowYear = firstShowDateRaw ? new Date(firstShowDateRaw).getUTCFullYear() : null;
    firstShowMonth = firstShowDateRaw ? new Date(firstShowDateRaw).getUTCMonth() : null;

    const lastShow = event.shows[event.shows.length - 1];
    lastShowDateRaw = lastShow.date;
    lastShowDate = lastShowDateRaw
      ? formatDateStringForFrontEnd(lastShowDateRaw)
      : null;
    // lastShowYear = lastShowDateRaw ? lastShowDateRaw.getUTCFullYear() : null;
    // lastShowMonth = lastShowDateRaw ? lastShowDateRaw.getUTCMonth() : null;
  }

  const isPastEvent = lastShowDateRaw && lastShowDateRaw < new Date();

  let detailData = {};

  if (isRequireDetail) {
    detailData = {
      info: {
        scenarist: getArraySafe(event.scenarists).map(scenarist => {
          return getEntityPropByLanguage(scenarist, 'name', language);
        }),
        scriptMasters: getArraySafe(event.scriptMasters).map(scriptMaster => {
          return getEntityPropByLanguage(scriptMaster, 'name', language);
        }),
        heading: getEntityPropByLanguage(event, 'descHeadline', language),
        description: getEntityPropByLanguage(event, 'desc', language),
        remark: getEntityPropByLanguage(event, 'remarks', language)
      },
      gallery: getArraySafe(event.gallery).map(medium => {
        return {
          src: medium && medium.url
        };
      }),
      relatedActors: getArraySafe(event.artists).map(artistWithRole => {
        const artist = artistWithRole.artist;

        /**
         * !!!Important!!!
         * guestArtistRemarks is now used by both guest and non-guest artists
         */
        const artistRemarks = getEntityPropByLanguage(
          artistWithRole,
          'guestArtistRemarks',
          language
        );

        return {
          role: getEntityPropByLanguage(artistWithRole, 'role', language),
          artist:
            artistWithRole.isGuestArtist !== true
              ? {
                  id: artist._id,
                  label: cleanLabelForSendingToFrontEnd(artist.label),
                  name: getEntityPropByLanguage(artist, 'name', language),
                  featuredImage: {
                    src: artist.featuredImage && artist.featuredImage.url
                  },
                  remarks: artistRemarks
                }
              : {
                  id: null,
                  label: null,
                  name: getEntityPropByLanguage(
                    artistWithRole,
                    'guestArtistName',
                    language
                  ),
                  featuredImage: {
                    src:
                      artistWithRole.guestArtistImage &&
                      artistWithRole.guestArtistImage.url
                  },
                  remarks: artistRemarks
                }
        };
      }),
      pageMeta: getPageMetaForFrontEnd(
        event.pageMeta,
        language,
        defaultPageMeta
      )
    };
  }

  return {
    id: event._id,
    label: cleanLabelForSendingToFrontEnd(event.label),
    name: name,
    nameForLongDisplay: nameForLongDisplay,
    type: event.type,
    themeColor: event.themeColor,
    artDirector: getArraySafe(event.artDirectors).map(artDirector => ({
      id: artDirector._id,
      label: cleanLabelForSendingToFrontEnd(artDirector.label),
      name: getEntityPropByLanguage(artDirector, 'name', language),
      featuredImage: {
        src: artDirector.featuredImage && artDirector.featuredImage.url
      }
    })),
    fromDate: firstShowDate,
    // fromDateRaw: firstShowDateRaw,
    // fromYear: firstShowYear,
    // fromMonth: firstShowMonth,
    toDate: firstShowDate !== lastShowDate ? lastShowDate : undefined,
    // toDateRaw: lastShowDateRaw,
    // toYear: lastShowYear,
    // toMonth: lastShowMonth,
    isPastEvent: isPastEvent,
    year: firstShowYear,
    month: firstShowMonth,
    schedule: getArraySafe(event.shows).map(show => ({
      date: {
        from: show.date ? formatDateStringForFrontEnd(show.date) : null,
        to: null
      },
      time: show.startTime
    })),
    featuredImage: {
      src: event.featuredImage && event.featuredImage.url
    },
    ...detailData
  };
};

const getSortedEvents = async (req, sortOrder = 1, isGetAllTypes = false) => {
  // query
  const query = req.query;
  let type = query.type && query.type.toUpperCase();

  if (!isValidEventType(type)) {
    type = defaultEventType;
  }

  const findOptions = {
    isEnabled: {
      $ne: false
    }
  };

  if (!isGetAllTypes) {
    findOptions.type = type;
  }

  const language = req.language;

  const events = await Event.find(findOptions)
    .select(eventSelectForFindAll)
    .populate(eventPopulationListForFindAll);

  const {
    sortedEvents,
    closestEvent,
    closestEventIdx,
    closestEventInPresentOrFuture,
    closestEventInPresentOrFutureIdx
  } = mapAndSortEvents(
    events,
    event => {
      return getEventForFrontEndFromDbEvent(event, language);
    },
    sortOrder
  );

  return {
    sortedEvents,
    closestEvent,
    closestEventIdx,
    closestEventInPresentOrFuture,
    closestEventInPresentOrFutureIdx
  };
};

/* end of utilities */

// Note: this api route is currently not used
// @route   GET api/frontend/events/:lang/events
// @desc    Get all events
// @access  Public
// @query   type=EVENT or COMMUNITY_PERFORMANCE
router.get('/:lang/events', [languageHandling], async (req, res) => {
  try {
    const { sortedEvents } = await getSortedEvents(req);

    addThemeColorDefaultToEvents(sortedEvents);
    res.json(sortedEvents);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/events/:lang/currentAndFutureEvents
// @desc    Get all events - current and future
// @access  Public
// @query   type=EVENT or COMMUNITY_PERFORMANCE
router.get(
  '/:lang/currentAndFutureEvents',
  [languageHandling],
  async (req, res) => {
    try {
      const {
        sortedEvents,
        closestEventIdx,
        closestEventInPresentOrFutureIdx
      } = await getSortedEvents(req);

      let eventsToReturn = [];
      if (closestEventInPresentOrFutureIdx >= 0) {
        eventsToReturn = sortedEvents.slice(closestEventInPresentOrFutureIdx);
      } else if (closestEventIdx >= 0) {
        eventsToReturn = sortedEvents.slice(closestEventIdx);
      } else {
        eventsToReturn = sortedEvents;
      }

      addThemeColorDefaultToEvents(eventsToReturn);
      res.json(eventsToReturn);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// Note: this api route is currently not used
// @route   GET api/frontend/events/:lang/pastEvents
// @desc    Get all events - past
// @access  Public
// @query   type=EVENT or COMMUNITY_PERFORMANCE
router.get('/:lang/pastEvents', [languageHandling], async (req, res) => {
  try {
    const {
      sortedEvents,
      closestEventIdx,
      closestEventInPresentOrFutureIdx
    } = await getSortedEvents(req);

    let eventsToReturn = [];
    if (closestEventInPresentOrFutureIdx >= 0) {
      eventsToReturn = sortedEvents.slice(0, closestEventInPresentOrFutureIdx);
    } else if (closestEventIdx >= 0) {
      eventsToReturn = sortedEvents.slice(0, closestEventIdx);
    } else {
      eventsToReturn = sortedEvents;
    }

    addThemeColorDefaultToEvents(eventsToReturn);
    res.json(eventsToReturn.reverse());
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/events/:lang/archive
// @desc    Get all events - archive (i.e. excluding future years)
// @access  Public
// @query   type=EVENT or COMMUNITY_PERFORMANCE
router.get('/:lang/archive', [languageHandling], async (req, res) => {
  try {
    const { sortedEvents } = await getSortedEvents(req);

    const eventsByYear = {};
    // isPastEvent field added to event by getEventForFrontEndFromDbEvent()
    sortedEvents
      .filter(event => {
        return event.isPastEvent;
      })
      .forEach((event, index) => {
        addThemeColorDefaultToEvent(event, index);

        // year field added to event by getEventForFrontEndFromDbEvent()
        const yearStr = event.year.toString();
        if (!eventsByYear[yearStr]) {
          eventsByYear[yearStr] = {};
        }

        const monthStr = event.month.toString();
        if (Array.isArray(eventsByYear[yearStr][monthStr])) {
          eventsByYear[yearStr][monthStr].push(event);
        } else {
          eventsByYear[yearStr][monthStr] = [event];
        }
      });

    // descending year here
    const eventsByYearArray = Object.keys(eventsByYear)
      .sort()
      .reverse()
      .map(year => {
        return {
          year: year,
          events: eventsByYear[year]
        };
      });

    res.json(eventsByYearArray);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/events/:lang/events/:label
// @desc    Get event by label
// @access  Public
router.get(
  '/:lang/events/:label',
  [languageHandling, frontEndDetailPageApiLabelHandling],
  async (req, res) => {
    try {
      const label = req.detailItemLabel;
      const language = req.language;

      const pageMetaMiscellaneous = await getPageMetaMiscellaneousFromDb(
        true,
        res
      );
      if (!pageMetaMiscellaneous) {
        return;
      }

      const defaultPageMeta = getMixedPageMetas(
        pageMetaMiscellaneous.eventListMeta,
        pageMetaMiscellaneous.landingPageMeta
      );

      const event = await Event.findOne({
        label: label
      })
        .select(eventSelectForFindOne)
        .populate(eventPopulationListForFindOne);

      if (!event) {
        return res
          .status(404)
          .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
      }

      const eventForFrontEnd = getEventForFrontEndFromDbEvent(
        event,
        language,
        true,
        defaultPageMeta
      );

      /* finding related events, i.e. events in the same phase */

      if (event.type === eventTypes.EVENT) {
        const relatedEvents = [];

        for (const phaseId of getArraySafe(event.phasesInvolved)) {
          const phase = await Phase.findById(phaseId)
            .select({
              events: 1
            })
            .populate(eventPopulationListForRelatedEvents);

          if (!phase) {
            return res
              .status(404)
              .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });
          }

          for (const relatedEvent of getArraySafe(phase.events)) {
            if (relatedEvent.label === label) {
              continue;
            }

            const relatedEventForFrontEnd = {
              id: relatedEvent._id,
              label: cleanLabelForSendingToFrontEnd(relatedEvent.label),
              name: getEntityPropByLanguage(relatedEvent, 'name', language),
              artDirectors: getArraySafe(relatedEvent.artDirectors).map(
                artDirector => ({
                  id: artDirector._id,
                  label: cleanLabelForSendingToFrontEnd(artDirector.label),
                  name: getEntityPropByLanguage(artDirector, 'name', language)
                })
              )
            };

            if (isNonEmptyArray(relatedEvent.shows)) {
              const firstShow = relatedEvent.shows[0];
              const lastShow =
                relatedEvent.shows[relatedEvent.shows.length - 1];
              relatedEventForFrontEnd.fromDate = firstShow.date
                ? formatDateStringForFrontEnd(firstShow.date)
                : null;
              relatedEventForFrontEnd.toDate = lastShow.date
                ? formatDateStringForFrontEnd(lastShow.date)
                : null;
            } else {
              relatedEventForFrontEnd.fromDate = null;
              relatedEventForFrontEnd.toDate = null;
            }

            relatedEvents.push(relatedEventForFrontEnd);
          }

          if (relatedEvents.length > 0) {
            // break phase loop
            break;
          }
        }

        eventForFrontEnd.relatedEvents = relatedEvents;
      }

      /* end of finding related events */

      addThemeColorDefaultToEvent(eventForFrontEnd);

      res.json(eventForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports.router = router;

module.exports.addThemeColorDefaultToEvents = addThemeColorDefaultToEvents;
