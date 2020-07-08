import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import MediaContext from './mediaContext';
import mediaReducer from './mediaReducer';
import Medium from 'models/medium';
import handleServerError from '../handleServerError';
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
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  media: null,
  mediaPaginationMeta: null,
  medium: null,
  mediaErrors: null,
  mediaLoading: false
};

const MediaState = ({ children }) => {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  // Get Media
  const getMedia = useCallback(async (mediumType, options) => {
    dispatch({ type: SET_MEDIA_LOADING });
    let url = `/api/backend/media/${mediumType.apiRoute}`;
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
        media: docs,
        meta: meta
      };
      dispatch({ type: GET_MEDIA, payload: payload });
    } catch (err) {
      handleServerError(err, MEDIA_ERRORS, dispatch);
    }
  }, []);

  // Clear Media
  const clearMedia = useCallback(_ => {
    dispatch({ type: CLEAR_MEDIA });
  }, []);

  // Get Medium
  const getMedium = useCallback(async (mediumType, mediumId) => {
    if (!mediumId) {
      dispatch({
        type: MEDIA_ERRORS,
        payload: [Medium.mediaResponseTypes.MEDIUM_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_MEDIA_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/media/${mediumType.apiRoute}/${mediumId}`
      );
      dispatch({ type: GET_MEDIUM, payload: res.data });
    } catch (err) {
      handleServerError(err, MEDIA_ERRORS, dispatch);
    }
  }, []);

  // Clear Medium
  const clearMedium = useCallback(_ => {
    dispatch({ type: CLEAR_MEDIUM });
  }, []);

  // Add Medium
  const addMedium = useCallback(async (mediumType, medium, userConfig) => {
    let newMedium = null;
    dispatch({ type: SET_MEDIA_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...userConfig
    };
    try {
      const res = await axios.post(
        `/api/backend/media/${mediumType.apiRoute}`,
        medium,
        config
      );
      dispatch({ type: ADD_MEDIUM, payload: res.data });
      newMedium = res.data;
    } catch (err) {
      handleServerError(err, MEDIA_ERRORS, dispatch);
    }
    return newMedium;
  }, []);

  // Update Medium
  const updateMedium = useCallback(async (mediumType, medium) => {
    let newMedium = null;
    dispatch({ type: SET_MEDIA_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/media/${mediumType.apiRoute}/${medium._id}`,
        medium,
        config
      );
      dispatch({ type: UPDATE_MEDIUM, payload: res.data });
      newMedium = res.data;
    } catch (err) {
      handleServerError(err, MEDIA_ERRORS, dispatch);
    }
    return newMedium;
  }, []);

  // Clear Media Error
  const clearMediaErrors = useCallback(_ => {
    dispatch({ type: CLEAR_MEDIA_ERRORS });
  }, []);

  return (
    <MediaContext.Provider
      value={{
        media: state.media,
        mediaPaginationMeta: state.mediaPaginationMeta,
        medium: state.medium,
        mediaErrors: state.mediaErrors,
        getMedia,
        clearMedia,
        getMedium,
        clearMedium,
        addMedium,
        updateMedium,
        clearMediaErrors
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaState;
