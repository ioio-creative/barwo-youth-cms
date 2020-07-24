import {
  GET_ARTISTS,
  CLEAR_ARTISTS,
  GET_ARTIST,
  CLEAR_ARTIST,
  ADD_ARTIST,
  UPDATE_ARTIST,
  ARTISTS_ERRORS,
  CLEAR_ARTISTS_ERRORS,
  DELETE_ARTIST,
  SET_ARTISTS_LOADING,
  GET_ART_DIRECTORS,
  CLEAR_ART_DIRECTORS,
  SET_ART_DIRECTORS_LOADING,
  ORDER_ART_DIRECTORS,
  GET_EVENT_ARTISTS,
  CLEAR_EVENT_ARTISTS,
  SET_EVENT_ARTISTS_LOADING,
  ORDER_EVENT_ARTISTS
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
        artist: null,
        artistsErrors: null
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
    case DELETE_ARTIST:
      return {
        ...state,
        artistsLoading: false
      };
    case SET_ARTISTS_LOADING:
      return {
        ...state,
        artistsLoading: true
      };
    case GET_ART_DIRECTORS:
      return {
        ...state,
        artDirectors: action.payload,
        artDirectorsLoading: false
      };
    case CLEAR_ART_DIRECTORS:
      return {
        ...state,
        artDirectors: null,
        artistsErrors: null
      };
    case SET_ART_DIRECTORS_LOADING:
      return {
        ...state,
        artDirectorsLoading: true
      };
    case ORDER_ART_DIRECTORS:
      return {
        ...state,
        artDirectorsLoading: false
      };
    case GET_EVENT_ARTISTS:
      return {
        ...state,
        eventArtists: action.payload,
        eventArtistsLoading: false
      };
    case CLEAR_EVENT_ARTISTS:
      return {
        ...state,
        eventArtists: null,
        artistsErrors: null
      };
    case SET_EVENT_ARTISTS_LOADING:
      return {
        ...state,
        eventArtistsLoading: true
      };
    case ORDER_EVENT_ARTISTS:
      return {
        ...state,
        eventArtistsLoading: false
      };
    default:
      return state;
  }
};
