const {
  isNonEmptyArray,
  getArraySafe
} = require('../js/array/isNonEmptyArray');
const firstOrDefault = require('../js/array/firstOrDefault');
const maxBy = require('../js/array/maxBy');
const minBy = require('../js/array/minBy');
const sortBy = require('../js/array/sortBy');
const { isFunction } = require('../js/function/isFunction');
const { formatDateString } = require('../datetime');

const mapAndSortActivities = (activities, mapFunc = null) => {
  const activitiesWithTimestamps = getArraySafe(activities).map(activity => {
    const activityFields = isFunction(mapFunc) ? mapFunc(activity) : activity;

    const activityFromTimestamp = activity.fromDate
      ? Date.parse(activity.fromDate)
      : null;
    const activityToTimestamp = activity.toDate
      ? Date.parse(activity.toDate)
      : null;

    const currTimestamp = Date.now();
    let isActivityOn = false;
    if (activityFromTimestamp !== null && activityToTimestamp !== null) {
      isActivityOn =
        activityFromTimestamp <= currTimestamp &&
        currTimestamp <= activityToTimestamp;
    }

    let timestampDistanceFromCurrent = null;
    if (isActivityOn) {
      timestampDistanceFromCurrent = 0;
    } else if (activityFromTimestamp !== null && activityToTimestamp !== null) {
      if (currTimestamp >= activityToTimestamp) {
        // negative, past activities
        timestampDistanceFromCurrent = activityToTimestamp - currTimestamp;
      } else if (currTimestamp <= activityFromTimestamp) {
        // positive, future activities
        timestampDistanceFromCurrent = activityFromTimestamp - currTimestamp;
      }
    }

    return {
      ...activityFields,
      fromTimestamp: activityFromTimestamp,
      toTimestamp: activityToTimestamp,
      timestampDistanceFromCurrent
    };
  });

  // calculate closestActivity
  // by first calculating
  // activitiesWithNullTimestampDistanceFromCurrent,
  // activitiesWithPositiveTimestampDistanceFromCurrent,
  // activitiesWithNegativeTimestampDistanceFromCurrent

  const activitiesWithNullTimestampDistanceFromCurrent = [];
  const activitiesWithPositiveTimestampDistanceFromCurrent = [];
  const activitiesWithNegativeTimestampDistanceFromCurrent = [];

  for (const activityForFrontEnd of activitiesWithTimestamps) {
    if (activityForFrontEnd.timestampDistanceFromCurrent === null) {
      activitiesWithNullTimestampDistanceFromCurrent.push(activityForFrontEnd);
      continue;
    }

    // note this case includes isActivityOn === true case
    if (activityForFrontEnd.timestampDistanceFromCurrent >= 0) {
      activitiesWithPositiveTimestampDistanceFromCurrent.push(
        activityForFrontEnd
      );
      continue;
    }

    if (activityForFrontEnd.timestampDistanceFromCurrent < 0) {
      activitiesWithNegativeTimestampDistanceFromCurrent.push(
        activityForFrontEnd
      );
      continue;
    }
  }

  let closestActivity = minBy(
    activitiesWithPositiveTimestampDistanceFromCurrent,
    'timestampDistanceFromCurrent'
  );

  if (!closestActivity) {
    closestActivity = maxBy(
      activitiesWithNegativeTimestampDistanceFromCurrent,
      'timestampDistanceFromCurrent'
    );
  }

  if (!closestActivity) {
    closestActivity = firstOrDefault(
      activitiesWithNullTimestampDistanceFromCurrent,
      null
    );
  }

  // set isClosest field for activities
  let closestActivityIdx = -1;
  activitiesWithTimestamps.forEach((activityWithTimestamps, idx) => {
    activityWithTimestamps.isClosest =
      activityWithTimestamps === closestActivity;
    if (activityWithTimestamps.isClosest) {
      closestActivityIdx = idx;
    }
  });

  return {
    sortedActivities: sortBy(activitiesWithTimestamps, [
      'fromTimestamp',
      'toTimestamp'
    ]),
    closestActivity,
    closestActivityIdx
  };
};

module.exports = mapAndSortActivities;
