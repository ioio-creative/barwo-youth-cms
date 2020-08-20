const dateTimeLibrary = require('dayjs');

const { isNonEmptyArray } = require('./js/array/isNonEmptyArray');

/* constants */

// https://momentjs.com/docs/#/displaying/format/
// https://day.js.org/docs/en/parse/string-format
const defaultDateFormat = 'YYYY-MM-DD';
const frontEndDateFormat = 'DD. MM. YYYY';
const frontEndDateFormatForMongoDb = '%d. %m %Y';
//const defaultTimeLongFormat = 'HH:mm:ss';
const defaultTimeShortFormat = 'HH:mm';
const defaultDateTimeFormat = `${defaultDateFormat} ${defaultTimeShortFormat}`;

/* end of constants */

// convert yyyy-mm-dd to UTC
const convertStrToDate = str => {
  return Date.parse(str);
};

const currentDateTimeString = (format = defaultDateTimeFormat) => {
  return formatDateTimeString(dateTimeLibrary(), format);
};

const formatDateTimeString = (datetime, format = defaultDateTimeFormat) => {
  return datetime ? dateTimeLibrary(datetime).format(format) : '';
};

const formatDateString = (datetime, format = defaultDateFormat) => {
  return formatDateTimeString(datetime, format);
};

const formatDateStringForFrontEnd = datetime => {
  return formatDateTimeString(datetime, frontEndDateFormat);
};

const compareForDatesAscending = (date1, date2) => {
  return convertStrToDate(date1) - convertStrToDate(date2);
};

const compareForDatesDescending = (date1, date2) => {
  return -1 * compareForDatesAscending(date1, date2);
};

const sortDatesAscending = dates => {
  return dates.sort(compareForDatesAscending);
};

const sortDatesDescending = dates => {
  return dates.sort(compareForDatesDescending);
};

const datesMax = dates => {
  if (!isNonEmptyArray(dates)) {
    return null;
  }
  let maxDate = dates[0];
  for (let i = 0; i < dates.length; i++) {
    if (compareForDatesAscending(dates[i], maxDate) > 0) {
      maxDate = dates[i];
    }
  }
  return maxDate;
};

const datesMin = dates => {
  if (!isNonEmptyArray(dates)) {
    return null;
  }
  let minDate = dates[0];
  for (let i = 0; i < dates.length; i++) {
    if (compareForDatesAscending(dates[i], minDate) < 0) {
      minDate = dates[i];
    }
  }
  return minDate;
};

/* public functions */

module.exports.currentDateTimeString = currentDateTimeString;

module.exports.formatDateTimeString = formatDateTimeString;

module.exports.formatDateString = formatDateString;

module.exports.formatDateStringForFrontEnd = formatDateStringForFrontEnd;

module.exports.frontEndDateFormatForMongoDb = frontEndDateFormatForMongoDb;

module.exports.compareForDatesAscending = compareForDatesAscending;

module.exports.compareForDatesDescending = compareForDatesDescending;

module.exports.sortDatesAscending = sortDatesAscending;

module.exports.sortDatesDescending = sortDatesDescending;

module.exports.datesMax = datesMax;

module.exports.datesMin = datesMin;

/* end of public functions */
