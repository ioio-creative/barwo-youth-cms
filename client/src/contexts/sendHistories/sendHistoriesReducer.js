import {
  GET_SENDHISTORIES,
  CLEAR_SENDHISTORIES,
  GET_SENDHISTORY,
  SENDHISTORIES_ERRORS,
  CLEAR_SENDHISTORY,
  CLEAR_SENDHISTORIES_ERRORS,
  SET_SENDHISTORIES_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SENDHISTORIES:
      return {
        ...state,
        sendHistories: action.payload.sendHistories,
        sendHistoriesPaginationMeta: action.payload.meta,
        sendHistoriesLoading: false
      };
    case CLEAR_SENDHISTORIES:
      return {
        ...state,
        sendHistories: null,
        sendHistoriesPaginationMeta: null,
        sendHistoriesErrors: null
      };
    case GET_SENDHISTORY:
      return {
        ...state,
        sendHistory: action.payload,
        sendHistoriesLoading: false
      };
    case CLEAR_SENDHISTORY:
      return {
        ...state,
        sendHistory: null,
        sendHistoriesErrors: null
      };
    case SENDHISTORIES_ERRORS:
      return {
        ...state,
        sendHistoriesErrors: action.payload
      };
    case CLEAR_SENDHISTORIES_ERRORS:
      return {
        ...state,
        sendHistoriesErrors: null
      };
    case SET_SENDHISTORIES_LOADING:
      return {
        ...state,
        sendHistoriesLoading: true
      };
    default:
      return state;
  }
};
