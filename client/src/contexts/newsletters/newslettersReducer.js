import {
  GET_NEWSLETTERS,
  CLEAR_NEWSLETTERS,
  GET_NEWSLETTER,
  CLEAR_NEWSLETTER,
  ADD_NEWSLETTER,
  UPDATE_NEWSLETTER,
  NEWSLETTERS_ERRORS,
  CLEAR_NEWSLETTERS_ERRORS,
  DELETE_NEWSLETTER,
  SET_NEWSLETTERS_LOADING,
  SEND_NEWSLETTER
  // GET_NEWSLETTERS_IN_ORDER,
  // CLEAR_NEWSLETTERS_IN_ORDER,
  // ORDER_NEWSLETTERS,
  // SET_NEWSLETTERS_IN_ORDER_LOADING
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
        //newslettersInOrderLoading: false
      };
    case CLEAR_NEWSLETTERS_ERRORS:
      return {
        ...state,
        newslettersErrors: null
      };
    case DELETE_NEWSLETTER:
      return {
        ...state,
        newslettersLoading: false
      };
    case SET_NEWSLETTERS_LOADING:
      return {
        ...state,
        newslettersLoading: true
      };
    // case GET_NEWSLETTERS_IN_ORDER:
    //   return {
    //     ...state,
    //     newslettersInOrder: action.payload,
    //     newslettersInOrderLoading: false
    //   };
    // case CLEAR_NEWSLETTERS_IN_ORDER:
    //   return {
    //     ...state,
    //     newslettersInOrder: null,
    //     newslettersErrors: null
    //   };
    // case ORDER_NEWSLETTERS:
    //   return {
    //     ...state,
    //     newslettersInOrderLoading: false
    //   };
    // case SET_NEWSLETTERS_IN_ORDER_LOADING:
    //   return {
    //     ...state,
    //     newslettersInOrderLoading: true
    //   };
    default:
      return state;
  }
};
