import { SET_TITLE, REMOVE_TITLE } from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_TITLE:
      return action.payload;
    case REMOVE_TITLE:
      return '';
    default:
      return state;
  }
};
