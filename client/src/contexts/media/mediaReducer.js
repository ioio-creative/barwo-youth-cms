import {
  GET_MEDIA,
  CLEAR_MEDIA,
  GET_MEDIUM,
  CLEAR_MEDIUM,
  ADD_MEDIUM,
  UPDATE_MEDIUM,
  MEDIA_ERRORS,
  CLEAR_MEDIA_ERRORS,
  SET_MEDIA_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_MEDIA:
      return {
        ...state,
        media: action.payload.media,
        mediaPaginationMeta: action.payload.meta,
        mediaLoading: false
      };
    case CLEAR_MEDIA:
      return {
        ...state,
        media: null,
        mediaPaginationMeta: null,
        mediaErrors: null
      };
    case GET_MEDIUM:
      return {
        ...state,
        medium: action.payload,
        mediaLoading: false
      };
    case CLEAR_MEDIUM:
      return {
        ...state,
        medium: null
      };
    case ADD_MEDIUM:
      return {
        ...state,
        mediaLoading: false
      };
    case UPDATE_MEDIUM:
      return {
        ...state,
        mediaLoading: false
      };
    case MEDIA_ERRORS:
      return {
        ...state,
        mediaErrors: action.payload
      };
    case CLEAR_MEDIA_ERRORS:
      return {
        ...state,
        mediaErrors: null
      };
    case SET_MEDIA_LOADING:
      return {
        ...state,
        mediaLoading: true
      };
    default:
      return state;
  }
};
