const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const distinct = require('../../../utils/js/array/distinct');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const mapAndSortPhases = require('../../../utils/phases/mapAndSortPhases');
const { Phase } = require('../../../models/Phase');

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

    const phases = await Phase.find({
      isEnabled: true
    })
      .select(phaseSelectForFindAll)
      .populate(phasePopulationListForFindAll)
      .sort({
        derivedLabel: 1
      });

    const safePhases = getArraySafe(phases);

    //console.log(safePhases[0].events);

    const years = distinct(safePhases.map(phase => phase.year)).sort();

    const yearsForFrontEnd = [];

    const currentYear = new Date().getFullYear();

    for (const year of years) {
      const phasesOfYear = safePhases.filter(phase => phase.year === year);

      // set phasesOfYearForFrontEnd
      const { sortedPhases } = mapAndSortPhases(phasesOfYear, phase =>
        getPhaseForFrontEndFromDbPhase(phase, language)
      );

      yearsForFrontEnd.push({
        year: `${year} - ${year + 1}`,
        shows: sortedPhases,
        isClosest: currentYear === year
      });
    }

    res.json(yearsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
