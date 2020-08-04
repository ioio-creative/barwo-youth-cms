import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import NewsMediaItemsContext from './newsMediaItemsContext';
import newsMediaItemsReducer from './newsMediaItemsReducer';
import NewsMediaItem from 'models/newsMediaItem';
import handleServerError from '../handleServerError';
import {
  GET_NEWS_MEDIA_ITEMS,
  CLEAR_NEWS_MEDIA_ITEMS,
  GET_NEWS_MEDIA_ITEM,
  CLEAR_NEWS_MEDIA_ITEM,
  ADD_NEWS_MEDIA_ITEM,
  UPDATE_NEWS_MEDIA_ITEM,
  NEWS_MEDIA_ITEMS_ERRORS,
  CLEAR_NEWS_MEDIA_ITEMS_ERRORS,
  SET_NEWS_MEDIA_ITEMS_LOADING,
  DELETE_NEWS_MEDIA_ITEM
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  newsMediaItems: null,
  newsMediaItemsPaginationMeta: null,
  newsMediaItem: null,
  newsMediaItemsErrors: null,
  newsMediaItemsLoading: false
};

const NewsMediaItemsState = ({ children }) => {
  const [state, dispatch] = useReducer(newsMediaItemsReducer, initialState);

  // Get News Media Items
  const getNewsMediaItems = useCallback(async options => {
    dispatch({ type: SET_NEWS_MEDIA_ITEMS_LOADING });
    let url = '/api/backend/newsMediaItems/newsMediaItems';
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
        newsMediaItems: docs,
        meta: meta
      };
      dispatch({ type: GET_NEWS_MEDIA_ITEMS, payload: payload });
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_ITEMS_ERRORS, dispatch);
    }
  }, []);

  // Clear News Media Items
  const clearNewsMediaItems = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_ITEMS });
  }, []);

  // Get News Media Item
  const getNewsMediaItem = useCallback(async newsMediaItemId => {
    if (!newsMediaItemId) {
      dispatch({
        type: NEWS_MEDIA_ITEMS_ERRORS,
        payload: [
          NewsMediaItem.newsMediaItemsResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS
            .type
        ]
      });
      return;
    }
    dispatch({ type: SET_NEWS_MEDIA_ITEMS_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/newsMediaItems/newsMediaItems/${newsMediaItemId}`
      );
      dispatch({ type: GET_NEWS_MEDIA_ITEM, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_ITEMS_ERRORS, dispatch);
    }
  }, []);

  // Clear News Media Item
  const clearNewsMediaItem = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_ITEM });
  }, []);

  // Add News Media Item
  const addNewsMediaItem = useCallback(async newsMediaItem => {
    let newNewsMediaItem = null;
    dispatch({ type: SET_NEWS_MEDIA_ITEMS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/newsMediaItems/newsMediaItems',
        newsMediaItem,
        config
      );
      dispatch({ type: ADD_NEWS_MEDIA_ITEM, payload: res.data });
      newNewsMediaItem = res.data;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_ITEMS_ERRORS, dispatch);
    }
    return newNewsMediaItem;
  }, []);

  // Update News Media Item
  const updateNewsMediaItem = useCallback(async newsMediaItem => {
    let newNewsMediaItem = null;
    dispatch({ type: SET_NEWS_MEDIA_ITEMS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/newsMediaItems/newsMediaItems/${newsMediaItem._id}`,
        newsMediaItem,
        config
      );
      dispatch({ type: UPDATE_NEWS_MEDIA_ITEM, payload: res.data });
      newNewsMediaItem = res.data;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_ITEMS_ERRORS, dispatch);
    }
    return newNewsMediaItem;
  }, []);

  // Clear News Media Items Error
  const clearNewsMediaItemsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_ITEMS_ERRORS });
  }, []);

  // Delete News Media Item
  const deleteNewsMediaItem = useCallback(async newsMediaItemId => {
    let isSuccess = false;
    dispatch({ type: SET_NEWS_MEDIA_ITEMS_LOADING });
    try {
      await axios.delete(
        `/api/backend/newsMediaItems/newsMediaItems/${newsMediaItemId}`
      );
      dispatch({ type: DELETE_NEWS_MEDIA_ITEM });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_ITEMS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  return (
    <NewsMediaItemsContext.Provider
      value={{
        newsMediaItems: state.newsMediaItems,
        newsMediaItemsPaginationMeta: state.newsMediaItemsPaginationMeta,
        newsMediaItem: state.newsMediaItem,
        newsMediaItemsErrors: state.newsMediaItemsErrors,
        newsMediaItemsLoading: state.newsMediaItemsLoading,
        getNewsMediaItems,
        clearNewsMediaItems,
        getNewsMediaItem,
        clearNewsMediaItem,
        addNewsMediaItem,
        updateNewsMediaItem,
        clearNewsMediaItemsErrors,
        deleteNewsMediaItem
      }}
    >
      {children}
    </NewsMediaItemsContext.Provider>
  );
};

export default NewsMediaItemsState;
