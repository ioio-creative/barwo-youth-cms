const minBy = require('lodash.minby');

// https://docs-lodash.com/v4/min-by/
module.exports = (objects, propSelector) => {
  return minBy(objects, propSelector);
};
