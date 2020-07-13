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

const mapAndSortEvents = (events, mapFunc = null) => {
  const eventsWithTimestamps = events.map(event => {
    const eventFields = isFunction(mapFunc) ? mapFunc(event) : event;

    const showTimestamps = getArraySafe(event.shows).map(show => {
      return Date.parse(`${formatDateString(show.date)} ${show.startTime}`);
    });

    let minShowTimestamp = null;
    let maxShowTimestamp = null;
    if (isNonEmptyArray(showTimestamps)) {
      minShowTimestamp = showTimestamps[0];
      maxShowTimestamp = showTimestamps[showTimestamps.length - 1];
    }

    const currTimestamp = Date.now();
    let isShowOn = false;
    if (minShowTimestamp !== null && maxShowTimestamp !== null) {
      isShowOn =
        minShowTimestamp <= currTimestamp && currTimestamp <= maxShowTimestamp;
    }

    let timestampDistanceFromCurrent = null;
    if (isShowOn) {
      timestampDistanceFromCurrent = 0;
    } else if (minShowTimestamp !== null && maxShowTimestamp !== null) {
      if (currTimestamp >= maxShowTimestamp) {
        // negative, past shows
        timestampDistanceFromCurrent = maxShowTimestamp - currTimestamp;
      } else if (currTimestamp <= minShowTimestamp) {
        // positive, future shows
        timestampDistanceFromCurrent = minShowTimestamp - currTimestamp;
      }
    }

    return {
      ...eventFields,
      minShowTimestamp: minShowTimestamp,
      maxShowTimestamp: maxShowTimestamp,
      timestampDistanceFromCurrent: timestampDistanceFromCurrent
    };
  });

  // calculate closestEvent
  // by first calculating
  // eventsWithNullTimestampDistanceFromCurrent,
  // eventsWithPositiveTimestampDistanceFromCurrent,
  // eventsWithNegativeTimestampDistanceFromCurrent

  const eventsWithNullTimestampDistanceFromCurrent = [];
  const eventsWithPositiveTimestampDistanceFromCurrent = [];
  const eventsWithNegativeTimestampDistanceFromCurrent = [];

  for (const eventWithTimestamps of eventsWithTimestamps) {
    if (eventWithTimestamps.timestampDistanceFromCurrent === null) {
      eventsWithNullTimestampDistanceFromCurrent.push(eventWithTimestamps);
      continue;
    }

    // note this case includes isShowOn === true case
    if (eventWithTimestamps.timestampDistanceFromCurrent >= 0) {
      eventsWithPositiveTimestampDistanceFromCurrent.push(eventWithTimestamps);
      continue;
    }

    if (eventWithTimestamps.timestampDistanceFromCurrent < 0) {
      eventsWithNegativeTimestampDistanceFromCurrent.push(eventWithTimestamps);
      continue;
    }
  }

  let closestEvent = minBy(
    eventsWithPositiveTimestampDistanceFromCurrent,
    'timestampDistanceFromCurrent'
  );

  if (!closestEvent) {
    closestEvent = maxBy(
      eventsWithNegativeTimestampDistanceFromCurrent,
      'timestampDistanceFromCurrent'
    );
  }

  if (!closestEvent) {
    closestEvent = firstOrDefault(
      eventsWithNullTimestampDistanceFromCurrent,
      null
    );
  }

  // set isClosest field for relatedEventsForFrontEnd
  for (const eventWithTimestamps of eventsWithTimestamps) {
    eventWithTimestamps.isClosest = eventWithTimestamps === closestEvent;
  }

  return {
    sortedEvents: sortBy(eventsWithTimestamps, [
      'minShowTimestamp',
      'maxShowTimestamp'
    ]),
    closestEvent
  };
};

module.exports = mapAndSortEvents;
