import orderBy from 'lodash/orderBy';

// https://lodash.com/docs/4.17.15#orderBy
const sort = (collection, iteratees, orders) => {
  return orderBy(collection, iteratees, orders);
};

export default sort;
