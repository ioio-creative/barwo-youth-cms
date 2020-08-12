const {
  isNonEmptyArray,
  getArraySafe
} = require('../js/array/isNonEmptyArray');
const firstOrDefault = require('../js/array/firstOrDefault');
const maxBy = require('../js/array/maxBy');
const minBy = require('../js/array/minBy');
const orderBy = require('../js/array/orderBy');
const { isFunction } = require('../js/function/isFunction');
const { formatDateString } = require('../datetime');

const mapAndSortActivities = (activities, mapFunc = null, sortOrder = 1) => {
  const activitiesWithTimestamps = getArraySafe(activities).map(activity => {
    const activityFields = isFunction(mapFunc) ? mapFunc(activity) : activity;

    const activityFromTimestamp = activity.fromDate
      ? Date.parse(formatDateString(activity.fromDate))
      : null;
    const activityToTimestamp = activity.toDate
      ? Date.parse(formatDateString(activity.toDate))
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
      toTimestamp: activityToTimestamp || activityFromTimestamp,
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

  let closestActivity = null;
  let closestActivityInPresentOrFuture = null;

  closestActivity = closestActivityInPresentOrFuture = minBy(
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

  const sortedActivities =
    sortOrder === -1
      ? orderBy(
          activitiesWithTimestamps,
          ['toTimestamp', 'fromTimestamp'],
          ['desc', 'desc']
        )
      : orderBy(activitiesWithTimestamps, ['fromTimestamp', 'toTimestamp']);

  // set isClosest field for activities
  let closestActivityIdx = -1;
  let closestActivityInPresentOrFutureIdx = -1;
  activitiesWithTimestamps.forEach((activityWithTimestamps, idx) => {
    activityWithTimestamps.isClosest =
      activityWithTimestamps === closestActivity;
    activityWithTimestamps.isClosestInPresentOrFuture =
      activityWithTimestamps === closestActivityInPresentOrFuture;
    if (activityWithTimestamps.isClosest) {
      closestActivityIdx = idx;
    }
    if (activityWithTimestamps.isClosestInPresentOrFuture) {
      closestActivityInPresentOrFutureIdx = idx;
    }
  });

  return {
    sortedActivities,
    closestActivity,
    closestActivityIdx,
    closestActivityInPresentOrFuture,
    closestActivityInPresentOrFutureIdx
  };
};

module.exports = mapAndSortActivities;
