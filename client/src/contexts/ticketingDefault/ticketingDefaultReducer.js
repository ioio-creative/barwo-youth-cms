import {
  GET_TICKETING_DEFAULT,
  CLEAR_TICKETING_DEFAULT,
  UPDATE_TICKETING_DEFAULT,
  TICKETING_DEFAULT_ERRORS,
  CLEAR_TICKETING_DEFAULT_ERRORS,
  SET_TICKETING_DEFAULT_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_TICKETING_DEFAULT:
      return {
        ...state,
        ticketingDefault: action.payload,
        ticketingDefaultLoading: false
      };
    case CLEAR_TICKETING_DEFAULT:
      return {
        ...state,
        ticketingDefault: null
      };
    case UPDATE_TICKETING_DEFAULT:
      return {
        ...state,
        ticketingDefaultLoading: false
      };
    case TICKETING_DEFAULT_ERRORS:
      return {
        ...state,
        ticketingDefaultErrors: action.payload
      };
    case CLEAR_TICKETING_DEFAULT_ERRORS:
      return {
        ...state,
        ticketingDefaultErrors: null
      };
    case SET_TICKETING_DEFAULT_LOADING:
      return {
        ...state,
        ticketingDefaultLoading: true
      };
    default:
      return state;
  }
};
