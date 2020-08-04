import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import NewsMediaGroupsContext from './newsMediaGroupsContext';
import newsMediaGroupsReducer from './newsMediaGroupsReducer';
import NewsMediaGroup from 'models/newsMediaGroup';
import handleServerError from '../handleServerError';
import {
  GET_NEWS_MEDIA_GROUPS,
  CLEAR_NEWS_MEDIA_GROUPS,
  GET_NEWS_MEDIA_GROUP,
  CLEAR_NEWS_MEDIA_GROUP,
  ADD_NEWS_MEDIA_GROUP,
  UPDATE_NEWS_MEDIA_GROUP,
  NEWS_MEDIA_GROUPS_ERRORS,
  CLEAR_NEWS_MEDIA_GROUPS_ERRORS,
  SET_NEWS_MEDIA_GROUPS_LOADING,
  DELETE_NEWS_MEDIA_GROUP,
  GET_NEWS_MEDIA_GROUPS_IN_ORDER,
  CLEAR_NEWS_MEDIA_GROUPS_IN_ORDER,
  ORDER_NEWS_MEDIA_GROUPS,
  SET_NEWS_MEDIA_GROUPS_IN_ORDER_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  newsMediaGroups: null,
  newsMediaGroupsPaginationMeta: null,
  newsMediaGroup: null,
  newsMediaGroupsErrors: null,
  newsMediaGroupsLoading: false,
  newsMediaGroupsInOrder: null,
  newsMediaGroupsInOrderLoading: false
};

const NewsMediaGroupsState = ({ children }) => {
  const [state, dispatch] = useReducer(newsMediaGroupsReducer, initialState);

  // Get News Media Groups
  const getNewsMediaGroups = useCallback(async options => {
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_LOADING });
    let url = '/api/backend/newsMediaGroups/newsMediaGroups';
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
        newsMediaGroups: docs,
        meta: meta
      };
      dispatch({ type: GET_NEWS_MEDIA_GROUPS, payload: payload });
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
  }, []);

  // Clear News Media Groups
  const clearNewsMediaGroups = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_GROUPS });
  }, []);

  // Get News Media Group
  const getNewsMediaGroup = useCallback(async newsMediaGroupId => {
    if (!newsMediaGroupId) {
      dispatch({
        type: NEWS_MEDIA_GROUPS_ERRORS,
        payload: [
          NewsMediaGroup.newsMediaGroupsResponseTypes
            .NEWS_MEDIA_GROUP_NOT_EXISTS.type
        ]
      });
      return;
    }
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/newsMediaGroups/newsMediaGroups/${newsMediaGroupId}`
      );
      dispatch({ type: GET_NEWS_MEDIA_GROUP, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
  }, []);

  // Clear News Media Group
  const clearNewsMediaGroup = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_GROUP });
  }, []);

  // Add News Media Group
  const addNewsMediaGroup = useCallback(async newsMediaGroup => {
    let newNewsMediaGroup = null;
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/newsMediaGroups/newsMediaGroups',
        newsMediaGroup,
        config
      );
      dispatch({ type: ADD_NEWS_MEDIA_GROUP, payload: res.data });
      newNewsMediaGroup = res.data;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
    return newNewsMediaGroup;
  }, []);

  // Update News Media Group
  const updateNewsMediaGroup = useCallback(async newsMediaGroup => {
    let newNewsMediaGroup = null;
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/newsMediaGroups/newsMediaGroups/${newsMediaGroup._id}`,
        newsMediaGroup,
        config
      );
      dispatch({ type: UPDATE_NEWS_MEDIA_GROUP, payload: res.data });
      newNewsMediaGroup = res.data;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
    return newNewsMediaGroup;
  }, []);

  // Clear News Media Groups Error
  const clearNewsMediaGroupsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_GROUPS_ERRORS });
  }, []);

  // Delete News Media Group
  const deleteNewsMediaGroup = useCallback(async newsMediaGroupId => {
    let isSuccess = false;
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_LOADING });
    try {
      await axios.delete(
        `/api/backend/newsMediaGroups/newsMediaGroups/${newsMediaGroupId}`
      );
      dispatch({ type: DELETE_NEWS_MEDIA_GROUP });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  // Get News Media Groups in Order
  const getNewsMediaGroupsInOrder = useCallback(async year => {
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_IN_ORDER_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/newsMediaGroups/newsMediaGroupsInOrder/${year}`
      );
      dispatch({ type: GET_NEWS_MEDIA_GROUPS_IN_ORDER, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
  }, []);

  // Clear News Media Groups in Order
  const clearNewsMediaGroupsInOrder = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS_MEDIA_GROUPS_IN_ORDER });
  }, []);

  // Order News Media Groups
  const orderNewsMediaGroups = useCallback(async newsMediaGroups => {
    let isSuccess = false;
    dispatch({ type: SET_NEWS_MEDIA_GROUPS_IN_ORDER_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      await axios.post(
        '/api/backend/newsMediaGroups/newsMediaGroupsInOrder',
        { newsMediaGroups },
        config
      );
      dispatch({ type: ORDER_NEWS_MEDIA_GROUPS });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, NEWS_MEDIA_GROUPS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  return (
    <NewsMediaGroupsContext.Provider
      value={{
        newsMediaGroups: state.newsMediaGroups,
        newsMediaGroupsPaginationMeta: state.newsMediaGroupsPaginationMeta,
        newsMediaGroup: state.newsMediaGroup,
        newsMediaGroupsErrors: state.newsMediaGroupsErrors,
        newsMediaGroupsLoading: state.newsMediaGroupsLoading,
        getNewsMediaGroups,
        clearNewsMediaGroups,
        getNewsMediaGroup,
        clearNewsMediaGroup,
        addNewsMediaGroup,
        updateNewsMediaGroup,
        clearNewsMediaGroupsErrors,
        deleteNewsMediaGroup,
        getNewsMediaGroupsInOrder,
        clearNewsMediaGroupsInOrder,
        orderNewsMediaGroups
      }}
    >
      {children}
    </NewsMediaGroupsContext.Provider>
  );
};

export default NewsMediaGroupsState;
