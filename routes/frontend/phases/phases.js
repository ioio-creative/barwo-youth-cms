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
const distinct = require('../../../utils/js/array/distinct');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const mapAndSortPhases = require('../../../utils/phases/mapAndSortPhases');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const { Phase, getPhaseDerivedLabel } = require('../../../models/Phase');
const mediumSelect = require('../common/mediumSelect');
const { addThemeColorDefaultToEvents } = require('../events/events');

/* utilities */

const phaseSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

// const phaseSelectForFindOne = {
//   ...phaseSelectForFindAll
// };

const phasePopulationListForFindAll = [
  {
    path: 'downloadMedium',
    select: mediumSelect
  },
  {
    path: 'events',
    select: {
      _id: 1,
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      nameForLongDisplay_tc: 1,
      nameForLongDisplay_sc: 1,
      nameForLongDisplay_en: 1,
      shows: 1,
      artDirectors: 1,
      featuredImage: 1
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
      },
      {
        path: 'featuredImage',
        select: {
          url: 1
        }
      }
    ]
  }
];

//const phasePopulationListForFindOne = [...phasePopulationListForFindAll];

const findClosestYears = years => {
  let closestYear = null;
  if (isNonEmptyArray(years)) {
    const currentYear = new Date().getUTCFullYear();

    // find closestYear from future first
    let smallestYearsDiff = 100;
    for (const year of years) {
      const yearsDiff = year - currentYear;
      if (yearsDiff >= 0 && yearsDiff < smallestYearsDiff) {
        smallestYearsDiff = yearsDiff;
        closestYear = year;
      }
    }

    if (!closestYear) {
      // find closestYear from past
      smallestYearsDiff = 100;
      for (const year of years) {
        const yearsDiff = currentYear - year;
        if (yearsDiff >= 0 && yearsDiff < smallestYearsDiff) {
          smallestYearsDiff = yearsDiff;
          closestYear = year;
        }
      }
    }
  }

  return closestYear;
};

const mapYearToYearForFrontEnd = year => {
  return `${year} - ${year + 1}`;
};

const getEventForFrontEndFromDbEvent = (event, language) => {
  const name = getEntityPropByLanguage(event, 'name', language);
  let nameForLongDisplay = getEntityPropByLanguage(
    event,
    'nameForLongDisplay',
    language
  );
  nameForLongDisplay = nameForLongDisplay
    ? nameForLongDisplay.replace(/\n/g, '<br>')
    : name;

  const dates = getArraySafe(event.shows).map(show => show.date);
  let minDate = null;
  let maxDate = null;
  if (dates.length > 0) {
    minDate = formatDateStringForFrontEnd(dates[0]);
    maxDate = formatDateStringForFrontEnd(dates[dates.length - 1]);
  }

  return {
    id: event._id,
    label: cleanLabelForSendingToFrontEnd(event.label),
    name: name,
    nameForLongDisplay: nameForLongDisplay,
    themeColor: event.themeColor,
    artDirectors: getArraySafe(event.artDirectors).map(artDirector => ({
      id: artDirector._id,
      label: cleanLabelForSendingToFrontEnd(artDirector.label),
      name: getEntityPropByLanguage(artDirector, 'name', language)
    })),
    fromDate: minDate,
    toDate: maxDate,
    schedule: getArraySafe(event.shows).map(show => ({
      date: {
        from: show.date ? formatDateStringForFrontEnd(show.date) : null,
        to: null
      },
      time: show.startTime
    })),
    featuredImage: {
      url: event.featuredImage && event.featuredImage.url
    }
  };
};

const getPhaseForFrontEndFromDbPhase = (phase, language) => {
  /* events */
  const {
    sortedEvents,
    closestEventIdx,
    closestEventInPresentOrFutureIdx
  } = mapAndSortEvents(phase.events, event =>
    getEventForFrontEndFromDbEvent(event, language)
  );

  // set closestEventsInPresentOrFuture
  let closestEventsInPresentOrFuture = [];

  let closestEventsInPresentOrFutureIdxToUse = -1;
  if (closestEventInPresentOrFutureIdx >= 0) {
    closestEventsInPresentOrFutureIdxToUse = closestEventInPresentOrFutureIdx;
  } else if (closestEventIdx >= 0) {
    closestEventsInPresentOrFutureIdxToUse = closestEventIdx;
  }

  // make closestEventsInPresentOrFuture of length 2
  if (closestEventsInPresentOrFutureIdxToUse >= 0) {
    closestEventsInPresentOrFuture.push(
      sortedEvents[closestEventsInPresentOrFutureIdxToUse]
    );
    if (closestEventsInPresentOrFutureIdxToUse + 1 < sortedEvents.length) {
      closestEventsInPresentOrFuture.push(
        sortedEvents[closestEventsInPresentOrFutureIdxToUse + 1]
      );
    }
  }

  addThemeColorDefaultToEvents(closestEventsInPresentOrFuture);

  /* end of events */

  return {
    phaseNumber: phase.phaseNumber,
    themeColor: phase.themeColor,
    downloadName: getEntityPropByLanguage(phase, 'downloadName', language),
    downloadMedium: {
      src: phase.downloadMedium && phase.downloadMedium.url
    },
    ticketSaleRemarks: getEntityPropByLanguage(
      phase,
      'ticketSaleRemarks',
      language
    ),
    schedule: {
      date: {
        from: formatDateStringForFrontEnd(phase.fromDate),
        to: formatDateStringForFrontEnd(phase.toDate)
      }
    },
    selectedEvents: sortedEvents,
    closestEventsInPresentOrFuture: closestEventsInPresentOrFuture
  };
};

/* end of utilities */

// Note: this api route is currently not used
// @route   GET api/frontend/phases/:lang/phases
// @desc    Get all phases
// @access  Public
router.get('/:lang/phases', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const phases = await Phase.find({
      isEnabled: {
        $ne: false
      }
    })
      .select(phaseSelectForFindAll)
      .populate(phasePopulationListForFindAll)
      .sort({
        derivedLabel: 1
      });

    const safePhases = getArraySafe(phases);

    // descending years
    const years = distinct(safePhases.map(phase => phase.year))
      .sort()
      .reverse();

    const closestYear = findClosestYears(years);

    const yearsForFrontEnd = [];

    for (const year of years) {
      const phasesOfYear = safePhases.filter(phase => phase.year === year);

      // set phasesOfYearForFrontEnd
      const { sortedPhases } = mapAndSortPhases(phasesOfYear, phase =>
        getPhaseForFrontEndFromDbPhase(phase, language)
      );

      yearsForFrontEnd.push({
        year: mapYearToYearForFrontEnd(year),
        shows: sortedPhases,
        isClosest: closestYear === year
      });
    }

    res.json(yearsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/phases/:lang/closestYearPhases
// @desc    Get all phases in the closest year
// @access  Public
// @query   isShowAllPhases=1
router.get('/:lang/closestYearPhases', [languageHandling], async (req, res) => {
  try {
    // query
    const query = req.query;
    const isShowAllPhases = Number(query.isShowAllPhases) === 1;

    const language = req.language;

    const findOptions = {};

    // Yearly Schedule 年度演期表 still need to show all phases in the year including disabled phases
    if (!isShowAllPhases) {
      findOptions.isEnabled = {
        $ne: false
      };
    }

    const phases = await Phase.find(findOptions)
      .select(phaseSelectForFindAll)
      .populate(phasePopulationListForFindAll)
      .sort({
        derivedLabel: 1
      });

    const safePhases = getArraySafe(phases);

    // descending years
    const years = distinct(safePhases.map(phase => phase.year));

    const closestYear = findClosestYears(years);

    let showsOfClosestYear = {};

    if (closestYear) {
      const phasesOfYear = safePhases.filter(
        phase => phase.year === closestYear
      );

      // set phasesOfYearForFrontEnd
      const {
        sortedPhases,
        closestPhaseIdx,
        closestPhaseInPresentAndFutureIdx
      } = mapAndSortPhases(phasesOfYear, phase =>
        getPhaseForFrontEndFromDbPhase(phase, language)
      );

      // sortedPhases contain all phases of the year
      let phasesToReturn = sortedPhases;
      
      if (!isShowAllPhases) {
        // HUNG ADDED, to get the 補場 event in non-current phase
        const allEventsInAllPhases = [].concat.apply(
          [], 
          sortedPhases.map(phase => phase['closestEventsInPresentOrFuture'])
        );
        const sortedEvents = allEventsInAllPhases.sort((a,b) => {
          return a['minShowTimestamp'] - b['minShowTimestamp'];
        });
        const currentTimeStamp = Date.now();
        const allPresentAndFutureEvents = sortedEvents.filter(event => {
          return event['maxShowTimestamp'] > currentTimeStamp;
        });
        let displayEvents = sortedEvents[sortedEvents.length - 1];
        if (allPresentAndFutureEvents.length > 0) {
          displayEvents = allPresentAndFutureEvents.slice(0, 2);
        }
        // only show present and future phases of the year
        if (closestPhaseInPresentAndFutureIdx >= 0) {
          phasesToReturn = sortedPhases.slice(
            closestPhaseInPresentAndFutureIdx
          );
          phasesToReturn[0]['sortedEvents'] = 'closestPhaseInPresentAndFutureIdx';
        } else if (closestPhaseIdx > 0) {
          phasesToReturn = sortedPhases.slice(closestPhaseIdx);
          phasesToReturn[0]['sortedEvents'] = 'closestPhaseIdx';

        } else {
          phasesToReturn = sortedPhases[0];
          phasesToReturn[0]['sortedEvents'] = 'else';
        }
        if (Array.isArray(displayEvents)) {
          phasesToReturn[0]['closestEventsInPresentOrFuture'] = displayEvents;
        } else {
          phasesToReturn[0]['closestEventsInPresentOrFuture'] = [displayEvents];
        }
      }

      // cater for last phase of the year case,
      // add one phase from the next year
      /* 
        TODO: comment out phaseFindForFindAll
        may need to find out the meaning of this variable
      // */
      if (phasesToReturn.length === 1) {
        const nextPhase = await Phase.findOne({
          // ...phaseFindForFindAll,
          derivedLabel: getPhaseDerivedLabel(closestYear + 1, 1)
        })
          .select(phaseSelectForFindAll)
          .populate(phasePopulationListForFindAll);

        if (nextPhase) {
          phasesToReturn.push(nextPhase);
        }
      }

      showsOfClosestYear = {
        year: mapYearToYearForFrontEnd(closestYear),
        shows: phasesToReturn
      };
    }

    res.json(showsOfClosestYear);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
