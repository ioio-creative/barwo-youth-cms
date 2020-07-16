import {
  GET_NEWSES,
  CLEAR_NEWSES,
  GET_NEWS,
  CLEAR_NEWS,
  ADD_NEWS,
  UPDATE_NEWS,
  NEWSES_ERRORS,
  CLEAR_NEWSES_ERRORS,
  SET_NEWSES_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_NEWSES:
      return {
        ...state,
        newses: action.payload.newses,
        newsesPaginationMeta: action.payload.meta,
        newsesLoading: false
      };
    case CLEAR_NEWSES:
      return {
        ...state,
        newses: null,
        newsesPaginationMeta: null,
        newsesErrors: null
      };
    case GET_NEWS:
      return {
        ...state,
        news: action.payload,
        newsesLoading: false
      };
    case CLEAR_NEWS:
      return {
        ...state,
        news: null
      };
    case ADD_NEWS:
      return {
        ...state,
        newsesLoading: false
      };
    case UPDATE_NEWS:
      return {
        ...state,
        newsesLoading: false
      };
    case NEWSES_ERRORS:
      return {
        ...state,
        newsesErrors: action.payload
      };
    case CLEAR_NEWSES_ERRORS:
      return {
        ...state,
        newsesErrors: null
      };
    case SET_NEWSES_LOADING:
      return {
        ...state,
        newsesLoading: true
      };
    default:
      return state;
  }
};
