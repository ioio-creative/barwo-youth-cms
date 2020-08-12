const { getArraySafe } = require('../js/array/isNonEmptyArray');
const firstOrDefault = require('../js/array/firstOrDefault');
const maxBy = require('../js/array/maxBy');
const minBy = require('../js/array/minBy');
const orderBy = require('../js/array/orderBy');
const { isFunction } = require('../js/function/isFunction');
const { formatDateString } = require('../datetime');

const mapAndSortPhases = (phases, mapFunc = null, sortOrder = 1) => {
  const phasesWithTimestamps = getArraySafe(phases).map(phase => {
    const phaseFields = isFunction(mapFunc) ? mapFunc(phase) : phase;

    const phaseFromTimestamp = phase.fromDate
      ? Date.parse(formatDateString(phase.fromDate))
      : null;
    const phaseToTimestamp = phase.toDate
      ? Date.parse(formatDateString(phase.toDate))
      : null;

    //const currTimestamp = Date.now();
    const currentDate = new Date();
    const currTimestamp = Date.parse(
      formatDateString(
        new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          0,
          0,
          0
        )
      )
    );
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
      toTimestamp: phaseToTimestamp || phaseFromTimestamp,
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

  let closestPhase = null;
  let closestPhaseInPresentOrFuture = null;

  closestPhase = closestPhaseInPresentOrFuture = minBy(
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

  const sortedPhases =
    sortOrder === -1
      ? orderBy(
          phasesWithTimestamps,
          ['toTimestamp', 'fromTimestamp'],
          ['desc', 'desc']
        )
      : orderBy(phasesWithTimestamps, ['fromTimestamp', 'toTimestamp']);

  // set isClosest field for phases
  let closestPhaseIdx = -1;
  let closestPhaseInPresentAndFutureIdx = -1;
  phasesWithTimestamps.forEach((phaseWithTimestamps, idx) => {
    phaseWithTimestamps.isClosest = phaseWithTimestamps === closestPhase;
    phaseWithTimestamps.isClosestInPresentOrFuture =
      phaseWithTimestamps === closestPhaseInPresentOrFuture;
    if (phaseWithTimestamps.isClosest) {
      closestPhaseIdx = idx;
    }
    if (phaseWithTimestamps.isClosestInPresentOrFuture) {
      closestPhaseInPresentAndFutureIdx = idx;
    }
  });

  return {
    sortedPhases,
    closestPhase,
    closestPhaseIdx,
    closestPhaseInPresentOrFuture,
    closestPhaseInPresentAndFutureIdx
  };
};

module.exports = mapAndSortPhases;
