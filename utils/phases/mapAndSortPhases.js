const { getArraySafe } = require('../js/array/isNonEmptyArray');
const firstOrDefault = require('../js/array/firstOrDefault');
const maxBy = require('../js/array/maxBy');
const minBy = require('../js/array/minBy');
const sortBy = require('../js/array/sortBy');
const { isFunction } = require('../js/function/isFunction');

const mapAndSortPhases = (phases, mapFunc = null) => {
  const phasesWithTimestamps = getArraySafe(phases).map(phase => {
    const phaseFields = isFunction(mapFunc) ? mapFunc(phase) : phase;

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
      ...phaseFields,
      fromTimestamp: phaseFromTimestamp,
      toTimestamp: phaseToTimestamp,
      timestampDistanceFromCurrent
    };
  });

  // calculate closestPhase
  // by first calculating
  // phasesWithNullTimestampDistanceFromCurrent,
  // phasesWithPositiveTimestampDistanceFromCurrent,
  // phasesWithNegativeTimestampDistanceFromCurrent

  const phasesWithNullTimestampDistanceFromCurrent = [];
  const phasesWithPositiveTimestampDistanceFromCurrent = [];
  const phasesWithNegativeTimestampDistanceFromCurrent = [];

  for (const phaseForFrontEnd of phasesWithTimestamps) {
    if (phaseForFrontEnd.timestampDistanceFromCurrent === null) {
      phasesWithNullTimestampDistanceFromCurrent.push(phaseForFrontEnd);
      continue;
    }

    // note this case includes isPhaseOn === true case
    if (phaseForFrontEnd.timestampDistanceFromCurrent >= 0) {
      phasesWithPositiveTimestampDistanceFromCurrent.push(phaseForFrontEnd);
      continue;
    }

    if (phaseForFrontEnd.timestampDistanceFromCurrent < 0) {
      phasesWithNegativeTimestampDistanceFromCurrent.push(phaseForFrontEnd);
      continue;
    }
  }

  let closestPhase = minBy(
    phasesWithPositiveTimestampDistanceFromCurrent,
    'timestampDistanceFromCurrent'
  );

  if (!closestPhase) {
    closestPhase = maxBy(
      phasesWithNegativeTimestampDistanceFromCurrent,
      'timestampDistanceFromCurrent'
    );
  }

  if (!closestPhase) {
    closestPhase = firstOrDefault(
      phasesWithNullTimestampDistanceFromCurrent,
      null
    );
  }

  // set isClosest field for phases
  let closestPhaseIdx = -1;
  let phaseWithTimestamps = null;
  for (let i = 0; i < phasesWithTimestamps.length; i++) {
    phaseWithTimestamps = phasesWithTimestamps[i];
    phaseWithTimestamps.isClosest = phaseWithTimestamps === closestPhase;
    if (phaseWithTimestamps.isClosest) {
      closestPhaseIdx = i;
    }
  }

  return {
    sortedPhases: sortBy(phasesWithTimestamps, [
      'fromTimestamp',
      'toTimestamp'
    ]),
    closestPhase,
    closestPhaseIdx
  };
};

module.exports = mapAndSortPhases;
