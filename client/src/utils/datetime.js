import moment from 'moment';

export const dateTimeLibrary = moment;

/* constants */

// https://momentjs.com/docs/#/displaying/format/
// https://day.js.org/docs/en/parse/string-format
const defaultDateFormat = 'YYYY-MM-DD';
//const defaultTimeLongFormat = 'HH:mm:ss';
const defaultTimeShortFormat = 'HH:mm';
const defaultDateTimeFormat = `${defaultDateFormat} ${defaultTimeShortFormat}`;

/* end of constants */

/* private functions */

// convert yyyy-mm-dd to UTC
const convertStrToDate = str => {
  return Date.parse(str);
};

/* end of private functions */

/* public functions */

export const currentDateTimeString = (format = defaultDateTimeFormat) => {
  return formatDateTimeString(dateTimeLibrary());
};

export const formatDateTimeString = (
  datetime,
  format = defaultDateTimeFormat
) => {
  return datetime ? dateTimeLibrary(datetime).format(format) : '';
};

export const formatDateString = (datetime, format = defaultDateFormat) => {
  return formatDateTimeString(datetime, format);
};

export const compareForDatesAscending = (date1, date2) => {
  return convertStrToDate(date1) - convertStrToDate(date2);
};

export const compareForDatesDescending = (date1, date2) => {
  return -1 * compareForDatesAscending(date1, date2);
};

/* end of public functions */
