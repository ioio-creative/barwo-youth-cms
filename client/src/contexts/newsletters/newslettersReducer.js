import {
  GET_NEWSLETTERS,
  CLEAR_NEWSLETTERS,
  GET_NEWSLETTER,
  CLEAR_NEWSLETTER,
  ADD_NEWSLETTER,
  UPDATE_NEWSLETTER,
  NEWSLETTERS_ERRORS,
  CLEAR_NEWSLETTERS_ERRORS,
  SET_NEWSLETTERS_LOADING,
  SEND_NEWSLETTER
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_NEWSLETTERS:
      return {
        ...state,
        newsletters: action.payload.newsletters,
        newslettersPaginationMeta: action.payload.meta,
        newslettersLoading: false
      };
    case CLEAR_NEWSLETTERS:
      return {
        ...state,
        newsletters: null,
        newslettersPaginationMeta: null,
        newslettersErrors: null
      };
    case GET_NEWSLETTER:
      return {
        ...state,
        newsletter: action.payload,
        newslettersLoading: false
      };
    case CLEAR_NEWSLETTER:
      return {
        ...state,
        newsletter: null,
        newslettersErrors: null
      };
    case ADD_NEWSLETTER:
      return {
        ...state,
        newslettersLoading: false
      };
    case SEND_NEWSLETTER:
      return {
        ...state,
        newslettersLoading: false
      };
    case UPDATE_NEWSLETTER:
      return {
        ...state,
        newslettersLoading: false
      };
    case NEWSLETTERS_ERRORS:
      return {
        ...state,
        newslettersErrors: action.payload,
        newslettersLoading: false
      };
    case CLEAR_NEWSLETTERS_ERRORS:
      return {
        ...state,
        newslettersErrors: null
      };
    case SET_NEWSLETTERS_LOADING:
      return {
        ...state,
        newslettersLoading: true
      };
    default:
      return state;
  }
};
