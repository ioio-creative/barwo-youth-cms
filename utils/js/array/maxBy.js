const maxBy = require('lodash.maxby');

// https://docs-lodash.com/v4/max-by/
module.exports = (objects, propSelector) => {
  return maxBy(objects, propSelector);
};
