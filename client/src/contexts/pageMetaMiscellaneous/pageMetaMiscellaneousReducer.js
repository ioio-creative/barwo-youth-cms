import {
  GET_PAGE_META_MISCELLANEOUS,
  CLEAR_PAGE_META_MISCELLANEOUS,
  UPDATE_PAGE_META_MISCELLANEOUS,
  PAGE_META_MISCELLANEOUS_ERRORS,
  CLEAR_PAGE_META_MISCELLANEOUS_ERRORS,
  SET_PAGE_META_MISCELLANEOUS_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_PAGE_META_MISCELLANEOUS:
      return {
        ...state,
        pageMetaMiscellaneous: action.payload,
        pageMetaMiscellaneousLoading: false
      };
    case CLEAR_PAGE_META_MISCELLANEOUS:
      return {
        ...state,
        pageMetaMiscellaneous: null
      };
    case UPDATE_PAGE_META_MISCELLANEOUS:
      return {
        ...state,
        pageMetaMiscellaneousLoading: false
      };
    case PAGE_META_MISCELLANEOUS_ERRORS:
      return {
        ...state,
        pageMetaMiscellaneousErrors: action.payload,
        pageMetaMiscellaneousLoading: false
      };
    case CLEAR_PAGE_META_MISCELLANEOUS_ERRORS:
      return {
        ...state,
        pageMetaMiscellaneousErrors: null
      };
    case SET_PAGE_META_MISCELLANEOUS_LOADING:
      return {
        ...state,
        pageMetaMiscellaneousLoading: true
      };
    default:
      return state;
  }
};
