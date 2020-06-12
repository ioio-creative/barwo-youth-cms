import { SET_ALERTS, REMOVE_ALERTS } from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_ALERTS:
      return [...state, ...action.payload];
    case REMOVE_ALERTS:
      return [];
    default:
      return state;
  }
};
