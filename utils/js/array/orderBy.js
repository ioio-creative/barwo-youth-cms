const orderby = require('lodash.orderby');

// https://lodash.com/docs#orderBy
// https://docs-lodash.com/v4/sort-by/
module.exports = (objects, propsSelector, orders = null) => {
  return orderby(objects, propsSelector, orders);
};
