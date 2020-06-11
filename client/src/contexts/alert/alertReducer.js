import { SET_ALERT, REMOVE_ALERT, REMOVE_ALERTS } from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert._id !== action.payload);
    case REMOVE_ALERTS:
      return [];
    default:
      return state;
  }
};
