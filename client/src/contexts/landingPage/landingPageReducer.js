import {
  GET_LANDING_PAGE,
  CLEAR_LANDING_PAGE,
  UPDATE_LANDING_PAGE,
  LANDING_PAGE_ERRORS,
  CLEAR_LANDING_PAGE_ERRORS,
  SET_LANDING_PAGE_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_LANDING_PAGE:
      return {
        ...state,
        landingPage: action.payload,
        landingPageLoading: false
      };
    case CLEAR_LANDING_PAGE:
      return {
        ...state,
        landingPage: null
      };
    case UPDATE_LANDING_PAGE:
      return {
        ...state,
        landingPageLoading: false
      };
    case LANDING_PAGE_ERRORS:
      return {
        ...state,
        landingPageErrors: action.payload
      };
    case CLEAR_LANDING_PAGE_ERRORS:
      return {
        ...state,
        landingPageErrors: null
      };
    case SET_LANDING_PAGE_LOADING:
      return {
        ...state,
        landingPageLoading: true
      };
    default:
      return state;
  }
};
