import {
  GET_ABOUT,
  CLEAR_ABOUT,
  UPDATE_ABOUT,
  ABOUT_ERRORS,
  CLEAR_ABOUT_ERRORS,
  SET_ABOUT_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ABOUT:
      return {
        ...state,
        about: action.payload,
        aboutLoading: false
      };
    case CLEAR_ABOUT:
      return {
        ...state,
        about: null
      };
    case UPDATE_ABOUT:
      return {
        ...state,
        aboutLoading: false
      };
    case ABOUT_ERRORS:
      return {
        ...state,
        aboutErrors: action.payload,
        aboutLoading: false
      };
    case CLEAR_ABOUT_ERRORS:
      return {
        ...state,
        aboutErrors: null
      };
    case SET_ABOUT_LOADING:
      return {
        ...state,
        aboutLoading: true
      };
    default:
      return state;
  }
};
