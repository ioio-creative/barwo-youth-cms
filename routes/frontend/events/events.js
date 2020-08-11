const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  isNonEmptyArray,
  getArraySafe
} = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const { Event, eventResponseTypes } = require('../../../models/Event');
const { Phase, phaseResponseTypes } = require('../../../models/Phase');
const mediumSelect = require('../common/mediumSelect');

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
    path: 'featuredImage',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  }
];

const eventPopulationListForFindOne = [...eventPopulationListForFindAll];

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

const getEventForFrontEndFromDbEvent = (dbEvent, language, index) => {
  const event = dbEvent;

  return {
    id: event._id,
    label: event.label,
    name: getEntityPropByLanguage(event, 'name', language),
    themeColor:
      event.themeColor ||
      (index % 2 === 0 ? eventThemeColorDefault1 : eventThemeColorDefault2),
    artDirector: getArraySafe(event.artDirectors).map(artDirector => ({
      id: artDirector._id,
      label: artDirector.label,
      name: getEntityPropByLanguage(artDirector, 'name', language),
      featuredImage: {
        src: artDirector.featuredImage && artDirector.featuredImage.url
      }
    })),
    schedule: getArraySafe(event.shows).map(show => ({
      date: {
        from: show.date ? formatDateStringForFrontEnd(show.date) : null,
        to: null
      },
      time: show.startTime
    })),
    info: {
      scenarist: getArraySafe(event.scenarists).map(scenarist => {
        return getEntityPropByLanguage(scenarist, 'name', language);
      }),
      heading: getEntityPropByLanguage(event, 'descHeadline', language),
      description: getEntityPropByLanguage(event, 'desc', language),
      remark: getEntityPropByLanguage(event, 'remarks', language)
    },
    featuredImage: {
      src: event.featuredImage && event.featuredImage.url
    },
    gallery: getArraySafe(event.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    }),
    relatedActors: getArraySafe(event.artists).map(artistWithRole => {
      const artist = artistWithRole.artist;
      return {
        role: getEntityPropByLanguage(artistWithRole, 'role', language),
        artist: {
          id: artist._id,
          label: artist.label,
          name: getEntityPropByLanguage(artist, 'name', language),
          featuredImage: {
            src: artist.featuredImage && artist.featuredImage.url
          }
        }
      };
    })
  };
};

/* end of utilities */

// @route   GET api/frontend/events/:lang/events
// @desc    Get all events
// @access  Public
router.get('/:lang/events', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const events = await Event.find({
      isEnabled: {
        $ne: false
      }
    })
      .select(eventSelectForFindAll)
      .populate(eventPopulationListForFindAll);

    const { sortedEvents } = mapAndSortEvents(events, event => {
      return getEventForFrontEndFromDbEvent(event, language);
    });

    res.json(sortedEvents);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/events/:lang/currentAndFutureEvents
// @desc    Get all events - current and future
// @access  Public
router.get(
  '/:lang/currentAndFutureEvents',
  [languageHandling],
  async (req, res) => {
    try {
      const language = req.language;

      const events = await Event.find({
        isEnabled: {
          $ne: false
        }
      })
        .select(eventSelectForFindAll)
        .populate(eventPopulationListForFindAll);

      const { sortedEvents, closestEventIdx } = mapAndSortEvents(
        events,
        event => {
          return getEventForFrontEndFromDbEvent(event, language);
        }
      );

      res.json(sortedEvents.slice(closestEventIdx >= 0 ? closestEventIdx : 0));
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   GET api/frontend/events/:lang/events/:label
// @desc    Get event by label
// @access  Public
router.get('/:lang/events/:label', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const event = await Event.findOne({
      label: req.params.label
    })
      .select(eventSelectForFindOne)
      .populate(eventPopulationListForFindOne);

    if (!event) {
      return res
        .status(404)
        .json({ errors: [eventResponseTypes.EVENT_NOT_EXISTS] });
    }

    const eventForFrontEnd = getEventForFrontEndFromDbEvent(event, language);

    /* finding related events, i.e. events in the same phase */

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
        if (relatedEvent.label === req.params.label) {
          continue;
        }

        const relatedEventForFrontEnd = {
          id: relatedEvent._id,
          label: relatedEvent.label,
          name: getEntityPropByLanguage(relatedEvent, 'name', language),
          artDirectors: getArraySafe(relatedEvent.artDirectors).map(
            artDirector => ({
              id: artDirector._id,
              label: artDirector.label,
              name: getEntityPropByLanguage(artDirector, 'name', language)
            })
          )
        };

        if (isNonEmptyArray(relatedEvent.shows)) {
          const firstShow = relatedEvent.shows[0];
          const lastShow = relatedEvent.shows[relatedEvent.shows.length - 1];
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

    /* end of finding related events */

    eventForFrontEnd.relatedEvents = relatedEvents;

    res.json(eventForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
