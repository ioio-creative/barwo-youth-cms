import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import ArtistsContext from './artistsContext';
import artistsReducer from './artistsReducer';
import Artist from 'models/artist';
import handleServerError from '../handleServerError';
import {
  GET_ARTISTS,
  CLEAR_ARTISTS,
  GET_ARTIST,
  CLEAR_ARTIST,
  ADD_ARTIST,
  UPDATE_ARTIST,
  ARTISTS_ERRORS,
  CLEAR_ARTISTS_ERRORS,
  SET_ARTISTS_LOADING,
  GET_ART_DIRECTORS,
  CLEAR_ART_DIRECTORS,
  SET_ART_DIRECTORS_LOADING,
  GET_EVENT_ARTISTS,
  CLEAR_EVENT_ARTISTS,
  SET_EVENT_ARTISTS_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  artists: null,
  artistsPaginationMeta: null,
  artist: null,
  artistsErrors: null,
  artistsLoading: false,
  artDirectors: null,
  artDirectorsLoading: null,
  eventArtists: null,
  eventArtistsLoading: null
};

const ArtistsState = ({ children }) => {
  const [state, dispatch] = useReducer(artistsReducer, initialState);

  // Get Artists
  const getArtists = useCallback(async options => {
    dispatch({ type: SET_ARTISTS_LOADING });
    let url = '/api/backend/artists/artists';
    let queryString = '';
    if (options) {
      const { page, sortOrder, sortBy, filterText, limit } = options;
      queryString = setQueryStringValues(
        {
          page,
          sortOrder,
          sortBy,
          filterText,
          limit
        },
        ''
      );
    }
    //console.log(url + queryString);
    try {
      const res = await axios.get(url + queryString);
      const { docs, ...meta } = res.data;
      const payload = {
        artists: docs,
        meta: meta
      };
      dispatch({ type: GET_ARTISTS, payload: payload });
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Artists
  const clearArtists = useCallback(_ => {
    dispatch({ type: CLEAR_ARTISTS });
  }, []);

  // Get Artist
  const getArtist = useCallback(async artistId => {
    if (!artistId) {
      dispatch({
        type: ARTISTS_ERRORS,
        payload: [Artist.artistsResponseTypes.ARTIST_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_ARTISTS_LOADING });
    try {
      const res = await axios.get(`/api/backend/artists/artists/${artistId}`);
      dispatch({ type: GET_ARTIST, payload: res.data });
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Artist
  const clearArtist = useCallback(_ => {
    dispatch({ type: CLEAR_ARTIST });
  }, []);

  // Add Artist
  const addArtist = useCallback(async artist => {
    let newArtist = null;
    dispatch({ type: SET_ARTISTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/artists/artists',
        artist,
        config
      );
      dispatch({ type: ADD_ARTIST, payload: res.data });
      newArtist = res.data;
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
    return newArtist;
  }, []);

  // Update Artist
  const updateArtist = useCallback(async artist => {
    let newArtist = null;
    dispatch({ type: SET_ARTISTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/artists/artists/${artist._id}`,
        artist,
        config
      );
      dispatch({ type: UPDATE_ARTIST, payload: res.data });
      newArtist = res.data;
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
    return newArtist;
  }, []);

  // Clear Artists Error
  const clearArtistsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_ARTISTS_ERRORS });
  }, []);

  // Get Art Directors
  const getArtDirectors = useCallback(async _ => {
    dispatch({ type: SET_ART_DIRECTORS_LOADING });
    try {
      const res = await axios.get('/api/backend/artists/artDirectors');
      dispatch({ type: GET_ART_DIRECTORS, payload: res.data });
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Art Directors
  const clearArtDirectors = useCallback(_ => {
    dispatch({ type: CLEAR_ART_DIRECTORS });
  }, []);

  // Get Event Artists
  const getEventArtists = useCallback(async _ => {
    dispatch({ type: SET_EVENT_ARTISTS_LOADING });
    try {
      const res = await axios.get('/api/backend/artists/eventArtists');
      dispatch({ type: GET_EVENT_ARTISTS, payload: res.data });
    } catch (err) {
      handleServerError(err, ARTISTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Event Artists
  const clearEventArtists = useCallback(_ => {
    dispatch({ type: CLEAR_EVENT_ARTISTS });
  }, []);

  return (
    <ArtistsContext.Provider
      value={{
        artists: state.artists,
        artistsPaginationMeta: state.artistsPaginationMeta,
        artist: state.artist,
        artistsErrors: state.artistsErrors,
        artDirectors: state.artDirectors,
        artDirectorsLoading: state.artDirectorsLoading,
        eventArtists: state.eventArtists,
        eventArtistsLoading: state.eventArtistsLoading,
        getArtists,
        clearArtists,
        getArtist,
        clearArtist,
        addArtist,
        updateArtist,
        clearArtistsErrors,
        getArtDirectors,
        clearArtDirectors,
        getEventArtists,
        clearEventArtists
      }}
    >
      {children}
    </ArtistsContext.Provider>
  );
};

export default ArtistsState;
