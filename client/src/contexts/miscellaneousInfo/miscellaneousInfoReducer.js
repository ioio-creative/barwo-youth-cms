import {
  GET_MISCELLANEOUS_INFO,
  CLEAR_MISCELLANEOUS_INFO,
  UPDATE_MISCELLANEOUS_INFO,
  MISCELLANEOUS_INFO_ERRORS,
  CLEAR_MISCELLANEOUS_INFO_ERRORS,
  SET_MISCELLANEOUS_INFO_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_MISCELLANEOUS_INFO:
      return {
        ...state,
        miscellaneousInfo: action.payload,
        miscellaneousInfoLoading: false
      };
    case CLEAR_MISCELLANEOUS_INFO:
      return {
        ...state,
        miscellaneousInfo: null
      };
    case UPDATE_MISCELLANEOUS_INFO:
      return {
        ...state,
        miscellaneousInfoLoading: false
      };
    case MISCELLANEOUS_INFO_ERRORS:
      return {
        ...state,
        miscellaneousInfoErrors: action.payload,
        miscellaneousInfoLoading: false
      };
    case CLEAR_MISCELLANEOUS_INFO_ERRORS:
      return {
        ...state,
        miscellaneousInfoErrors: null
      };
    case SET_MISCELLANEOUS_INFO_LOADING:
      return {
        ...state,
        miscellaneousInfoLoading: true
      };
    default:
      return state;
  }
};
