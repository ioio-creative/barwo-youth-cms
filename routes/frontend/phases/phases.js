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
const { Phase } = require('../../../models/Phase');
const getDerivedLabel = require('../../../utils/phases/getDerivedLabel');

/* utilities */

const phaseFindForFindAll = {
  isEnabled: {
    $ne: false
  }
};

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
    path: 'events',
    select: {
      _id: 1,
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
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

const getPhaseForFrontEndFromDbPhase = (phase, language) => {
  /* events */
  const eventForFrontEndMapFunc = event => {
    const dates = getArraySafe(event.shows).map(show => show.date);
    let minDate = null;
    let maxDate = null;
    if (dates.length > 0) {
      minDate = formatDateStringForFrontEnd(dates[0]);
      maxDate = formatDateStringForFrontEnd(dates[dates.length - 1]);
    }
    return {
      id: event._id,
      label: event.label,
      name: getEntityPropByLanguage(event, 'name', language),
      artDirectors: getArraySafe(event.artDirectors).map(artDirector => ({
        id: artDirector._id,
        label: artDirector.label,
        name: getEntityPropByLanguage(artDirector, 'name', language)
      })),
      fromDate: minDate,
      toDate: maxDate,
      featuredImage: {
        url: event.featuredImage && event.featuredImage.url
      }
    };
  };

  const { sortedEvents } = mapAndSortEvents(
    phase.events,
    eventForFrontEndMapFunc
  );

  /* end of events */

  return {
    phaseNumber: phase.phaseNumber,
    themeColor: phase.themeColor,
    schedule: {
      date: {
        from: formatDateStringForFrontEnd(phase.fromDate),
        to: formatDateStringForFrontEnd(phase.toDate)
      }
    },
    selectedEvents: sortedEvents
  };
};

/* end of utilities */

// @route   GET api/frontend/phases/:lang/phases
// @desc    Get all phases
// @access  Public
router.get('/:lang/phases', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const phases = await Phase.find(phaseFindForFindAll)
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
router.get('/:lang/closestYearPhases', [languageHandling], async (req, res) => {
  try {
    // query
    const query = req.query;
    const isShowAllPhases = query.isShowAllPhases === 1;

    const language = req.language;

    const phases = await Phase.find(phaseFindForFindAll)
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
        // only show present and future phases of the year
        if (closestPhaseInPresentAndFutureIdx >= 0) {
          phasesToReturn = sortedPhases.slice(
            closestPhaseInPresentAndFutureIdx
          );
        } else if (closestPhaseIdx > 0) {
          phasesToReturn = sortedPhases.slice(closestPhaseIdx);
        } else {
          phasesToReturn = sortedPhases;
        }
      }

      // cater for last phase of the year case,
      // add one phase from the next year
      if (phasesToReturn.length === 1) {
        const nextPhase = await Phase.findOne({
          ...phaseFindForFindAll,
          derivedLabel: getDerivedLabel(closestYear + 1, 1)
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
