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
  SET_ARTISTS_LOADING
} from '../types';

const initialState = {
  artists: null,
  artistsPaginationMeta: null,
  artist: null,
  artistsErrors: null,
  artistsLoading: false
};

const ArtistsState = ({ children }) => {
  const [state, dispatch] = useReducer(artistsReducer, initialState);

  // Get Artists
  const getArtists = useCallback(async (options) => {
    dispatch({ type: SET_ARTISTS_LOADING });
    let url = '/api/artists?';
    if (options) {
      const { page } = options;
      url += page ? 'page=' + page : '';
    }
    try {
      const res = await axios.get(url);
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
      const res = await axios.get(`/api/artists/${artistId}`);
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
      const res = await axios.post('/api/artists', artist, config);
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
      const res = await axios.put(`/api/artists/${artist._id}`, artist, config);
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

  return (
    <ArtistsContext.Provider
      value={{
        artists: state.artists,
        artistsPaginationMeta: state.artistsPaginationMeta,
        artist: state.artist,
        artistsErrors: state.artistsErrors,
        getArtists,
        clearArtists,
        getArtist,
        clearArtist,
        addArtist,
        updateArtist,
        clearArtistsErrors
      }}
    >
      {children}
    </ArtistsContext.Provider>
  );
};

export default ArtistsState;
