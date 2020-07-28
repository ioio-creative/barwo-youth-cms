import {
  GET_GLOBAL_CONSTANTS,
  CLEAR_GLOBAL_CONSTANTS,
  UPDATE_GLOBAL_CONSTANTS,
  GLOBAL_CONSTANTS_ERRORS,
  CLEAR_GLOBAL_CONSTANTS_ERRORS,
  SET_GLOBAL_CONSTANTS_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_GLOBAL_CONSTANTS:
      return {
        ...state,
        globalConstants: action.payload,
        globalConstantsLoading: false
      };
    case CLEAR_GLOBAL_CONSTANTS:
      return {
        ...state,
        globalConstants: null
      };
    case UPDATE_GLOBAL_CONSTANTS:
      return {
        ...state,
        globalConstantsLoading: false
      };
    case GLOBAL_CONSTANTS_ERRORS:
      return {
        ...state,
        globalConstantsErrors: action.payload,
        globalConstantsLoading: false
      };
    case CLEAR_GLOBAL_CONSTANTS_ERRORS:
      return {
        ...state,
        globalConstantsErrors: null
      };
    case SET_GLOBAL_CONSTANTS_LOADING:
      return {
        ...state,
        globalConstantsLoading: true
      };
    default:
      return state;
  }
};
