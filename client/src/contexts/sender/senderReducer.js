import {
  GET_SENDER,
  CLEAR_SENDER,
  UPDATE_SENDER,
  SENDER_ERRORS,
  CLEAR_SENDER_ERRORS,
  SET_SENDER_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SENDER:
      return {
        ...state,
        sender: action.payload,
        senderLoading: false
      };
    case CLEAR_SENDER:
      return {
        ...state,
        sender: null
      };
    case UPDATE_SENDER:
      return {
        ...state,
        senderLoading: false
      };
    case SENDER_ERRORS:
      return {
        ...state,
        senderErrors: action.payload,
        senderLoading: false
      };
    case CLEAR_SENDER_ERRORS:
      return {
        ...state,
        senderErrors: null
      };
    case SET_SENDER_LOADING:
      return {
        ...state,
        senderLoading: true
      };
    default:
      return state;
  }
};
