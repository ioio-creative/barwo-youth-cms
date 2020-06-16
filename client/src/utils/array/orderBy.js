import orderBy from 'lodash.orderby';
import mapSortOrderStrToNum from './mapSortOrderStrToNum';

// https://lodash.com/docs/4.17.15#orderBy
const sort = (collection, iteratees, orders) => {
  const cleanedOrders = orders.map(mapSortOrderStrToNum);
  return orderBy(collection, iteratees, cleanedOrders);
};

export default sort;
