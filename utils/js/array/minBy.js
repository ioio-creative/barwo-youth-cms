const minBy = require('lodash.minBy');

// https://docs-lodash.com/v4/max-by/
module.exports = (objects, propSelector) => {
  return minBy(objects, propSelector);
};
