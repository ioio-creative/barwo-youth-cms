const sortEvents = events => {
  const eventsToReturn = events.map(event => {
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
  });
};

module.exports = sortEvents;
