import {
  GET_ARTISTS,
  CLEAR_ARTISTS,
  GET_ARTIST,
  CLEAR_ARTIST,
  ADD_ARTIST,
  UPDATE_ARTIST,
  ARTISTS_ERRORS,
  CLEAR_ARTISTS_ERRORS,
  SET_ARTISTS_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ARTISTS:
      return {
        ...state,
        artists: action.payload.artists,
        artistsPaginationMeta: action.payload.meta,
        artistsLoading: false
      };
    case CLEAR_ARTISTS:
      return {
        ...state,
        artists: null,
        artistsPaginationMeta: null,
        artistsErrors: null
      };
    case GET_ARTIST:
      return {
        ...state,
        artist: action.payload,
        artistsLoading: false
      };
    case CLEAR_ARTIST:
      return {
        ...state,
        artist: null
      };
    case ADD_ARTIST:
      return {
        ...state,
        artistsLoading: false
      };
    case UPDATE_ARTIST:
      return {
        ...state,
        artistsLoading: false
      };
    case ARTISTS_ERRORS:
      return {
        ...state,
        artistsErrors: action.payload
      };
    case CLEAR_ARTISTS_ERRORS:
      return {
        ...state,
        artistsErrors: null
      };
    case SET_ARTISTS_LOADING:
      return {
        ...state,
        artistsLoading: true
      };
    default:
      return state;
  }
};
