const { isNonEmptyArray } = require('./isNonEmptyArray');

const firstOrDefault = (array, defaultValue = null) => {
  return isNonEmptyArray(array) ? array[0] : defaultValue;
};

module.exports = firstOrDefault;
