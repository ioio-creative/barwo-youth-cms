// convert yyyy-mm-dd to UTC
const convertStrToDate = str => {
  return Date.parse(str);
};

const compareForDatesAscending = (date1, date2) => {
  return convertStrToDate(date1) - convertStrToDate(date2);
};

const compareForDatesDescending = (date1, date2) => {
  return -1 * compareForDatesAscending(date1, date2);
};

/* public functions */

module.exports.compareForDatesAscending = compareForDatesAscending;

module.exports.compareForDatesDescending = compareForDatesDescending;

/* end of public functions */
