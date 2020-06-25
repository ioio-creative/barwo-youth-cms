const compareForStringsAscending = (str1, str2) => {
  if (str1 < str2) {
    return -1;
  }
  if (str1 > str2) {
    return 1;
  }
  return 0;
};

const compareForStringsDescending = (str1, str2) => {
  return -1 * compareForStringsAscending(str1, str2);
};

/* public functions */

module.exports.compareForStringsAscending = compareForStringsAscending;

module.exports.compareForStringsDescending = compareForStringsDescending;

/* end of public functions */
