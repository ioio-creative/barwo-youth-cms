const dateTimeLibrary = require('dayjs');

/* constants */

// https://momentjs.com/docs/#/displaying/format/
// https://day.js.org/docs/en/parse/string-format
const defaultDateFormat = 'YYYY-MM-DD';
const frontEndDateFormat = 'DD. MM. YYYY';
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

/* public functions */

module.exports.currentDateTimeString = currentDateTimeString;

module.exports.formatDateTimeString = formatDateTimeString;

module.exports.formatDateString = formatDateString;

module.exports.formatDateStringForFrontEnd = formatDateStringForFrontEnd;

module.exports.compareForDatesAscending = compareForDatesAscending;

module.exports.compareForDatesDescending = compareForDatesDescending;

/* end of public functions */
