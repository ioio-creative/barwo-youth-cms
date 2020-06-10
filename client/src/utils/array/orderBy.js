import orderBy from 'lodash.orderby';

// https://lodash.com/docs/4.17.15#orderBy
const sort = (collection, iteratees, orders) => {
  return orderBy(collection, iteratees, orders);
};

export default sort;
