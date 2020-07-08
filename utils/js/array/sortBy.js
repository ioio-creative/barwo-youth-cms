const sortby = require('lodash.sortby');

// https://docs-lodash.com/v4/sort-by/
module.exports = (objects, propsSelector) => {
  return sortby(objects, propsSelector);
};
