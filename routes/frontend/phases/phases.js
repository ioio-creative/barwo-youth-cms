const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Phase } = require('../../../models/Phase');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  formatDateStringForFrontEnd,
  datesMin,
  datesMax
} = require('../../../utils/datetime');
const maxBy = require('../../../utils/js/array/maxBy');
const minBy = require('../../../utils/js/array/minBy');
const sortBy = require('../../../utils/js/array/sortBy');

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

    const years = new Set(safePhases.map(phase => phase.year));

    const yearsForFrontEnd = [];

    for (const year of years) {
      const phasesOfYear = safePhases.filter(phase => phase.year === year);

      // set phasesOfYearForFrontEnd
      const phasesOfYearForFrontEnd = phasesOfYear.map(phase => {
        const phaseFromTimestamp = phase.fromDate
          ? Date.parse(phase.fromDate)
          : null;
        const phaseToTimestamp = phase.toDate ? Date.parse(phase.toDate) : null;

        const currTimestamp = Date.now();
        let isPhaseOn = false;
        if (phaseFromTimestamp !== null && phaseToTimestamp !== null) {
          isPhaseOn =
            phaseFromTimestamp <= currTimestamp &&
            currTimestamp <= phaseToTimestamp;
        }

        let timestampDistanceFromCurrent = null;
        if (isPhaseOn) {
          timestampDistanceFromCurrent = 0;
        } else if (phaseFromTimestamp !== null && phaseToTimestamp !== null) {
          if (currTimestamp >= phaseToTimestamp) {
            // negative, past phases
            timestampDistanceFromCurrent = phaseToTimestamp - currTimestamp;
          } else if (currTimestamp <= phaseFromTimestamp) {
            // positive, future phases
            timestampDistanceFromCurrent = phaseFromTimestamp - currTimestamp;
          }
        }

        return {
          phaseNumber: phase.phaseNumber,
          themeColor: phase.themeColor,
          fromTimestamp: phaseFromTimestamp,
          toTimestamp: phaseToTimestamp,
          timestampDistanceFromCurrent: timestampDistanceFromCurrent,
          schedule: {
            date: {
              from: formatDateStringForFrontEnd(phase.fromDate),
              to: formatDateStringForFrontEnd(phase.toDate)
            }
          },
          selectedEvents: sortBy(
            getArraySafe(
              phase.events.map(event => {
                const dates = getArraySafe(event.shows).map(show => show.date);
                let minDate = null;
                let maxDate = null;
                if (dates.length > 0) {
                  minDate = formatDateStringForFrontEnd(datesMin(dates));
                  maxDate = formatDateStringForFrontEnd(datesMax(dates));
                }
                return {
                  id: event._id,
                  label: event.label,
                  name: getEntityPropByLanguage(event, 'name', language),
                  artDirectors: getArraySafe(event.artDirectors).map(
                    artDirector => ({
                      id: artDirector._id,
                      label: artDirector.label,
                      name: getEntityPropByLanguage(
                        artDirector,
                        'name',
                        language
                      )
                    })
                  ),
                  fromDate: minDate,
                  toDate: maxDate,
                  featuredImage: {
                    url: event.featuredImage && event.featuredImage.url
                  }
                };
              })
            ),
            ['fromDate', 'toDate']
          )
        };
      });

      // calculate closestPhaseForFrontEnd
      // by first calculating
      // phasesForFrontEndWithNullTimestampDistanceFromCurrent,
      // phasesForFrontEndWithPositiveTimestampDistanceFromCurrent,
      // phasesForFrontEndWithNegativeTimestampDistanceFromCurrent

      const phasesForFrontEndWithNullTimestampDistanceFromCurrent = [];
      const phasesForFrontEndWithPositiveTimestampDistanceFromCurrent = [];
      const phasesForFrontEndWithNegativeTimestampDistanceFromCurrent = [];

      for (const phaseForFrontEnd of phasesOfYearForFrontEnd) {
        if (phaseForFrontEnd.timestampDistanceFromCurrent === null) {
          phasesForFrontEndWithNullTimestampDistanceFromCurrent.push(
            phaseForFrontEnd
          );
          continue;
        }

        // note this case includes isPhaseOn === true case
        if (phaseForFrontEnd.timestampDistanceFromCurrent >= 0) {
          phasesForFrontEndWithPositiveTimestampDistanceFromCurrent.push(
            phaseForFrontEnd
          );
          continue;
        }

        if (phaseForFrontEnd.timestampDistanceFromCurrent < 0) {
          phasesForFrontEndWithNegativeTimestampDistanceFromCurrent.push(
            phaseForFrontEnd
          );
          continue;
        }
      }

      let closestPhaseForFrontEnd = minBy(
        phasesForFrontEndWithPositiveTimestampDistanceFromCurrent,
        'timestampDistanceFromCurrent'
      );

      if (!closestPhaseForFrontEnd) {
        closestPhaseForFrontEnd = maxBy(
          phasesForFrontEndWithNegativeTimestampDistanceFromCurrent,
          'timestampDistanceFromCurrent'
        );
      }

      if (!closestPhaseForFrontEnd) {
        closestPhaseForFrontEnd = firstOrDefault(
          phasesForFrontEndWithNullTimestampDistanceFromCurrent,
          null
        );
      }

      // set isClosest field for relatedEventsForFrontEnd
      for (const phaseForFrontEnd of phasesOfYearForFrontEnd) {
        phaseForFrontEnd.isClosest =
          phaseForFrontEnd === closestPhaseForFrontEnd;
      }

      yearsForFrontEnd.push({
        year: `${year} - ${year + 1}`,
        shows: sortBy(phasesOfYearForFrontEnd, ['fromTimestamp', 'toTimestamp'])
      });
    }

    res.json(yearsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
