import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import NewsesContext from './newsesContext';
import newsesReducer from './newsesReducer';
import News from 'models/news';
import handleServerError from '../handleServerError';
import {
  GET_NEWSES,
  CLEAR_NEWSES,
  GET_NEWS,
  CLEAR_NEWS,
  ADD_NEWS,
  UPDATE_NEWS,
  NEWSES_ERRORS,
  CLEAR_NEWSES_ERRORS,
  SET_NEWSES_LOADING,
  GET_NEWSES_IN_ORDER,
  CLEAR_NEWSES_IN_ORDER,
  ORDER_NEWSES,
  SET_NEWSES_IN_ORDER_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  newses: null,
  newsesPaginationMeta: null,
  news: null,
  newsesErrors: null,
  newsesLoading: false,
  newsesInOrder: null,
  newsesInOrderLoading: false
};

const NewsesState = ({ children }) => {
  const [state, dispatch] = useReducer(newsesReducer, initialState);

  // Get Newses
  const getNewses = useCallback(async options => {
    dispatch({ type: SET_NEWSES_LOADING });
    let url = '/api/backend/newses/newses';
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
        newses: docs,
        meta: meta
      };
      dispatch({ type: GET_NEWSES, payload: payload });
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
  }, []);

  // Clear Newses
  const clearNewses = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSES });
  }, []);

  // Get News
  const getNews = useCallback(async newsId => {
    if (!newsId) {
      dispatch({
        type: NEWSES_ERRORS,
        payload: [News.newsesResponseTypes.NEWS_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_NEWSES_LOADING });
    try {
      const res = await axios.get(`/api/backend/newses/newses/${newsId}`);
      dispatch({ type: GET_NEWS, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
  }, []);

  // Clear News
  const clearNews = useCallback(_ => {
    dispatch({ type: CLEAR_NEWS });
  }, []);

  // Add News
  const addNews = useCallback(async news => {
    let newNews = null;
    dispatch({ type: SET_NEWSES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/backend/newses/newses', news, config);
      dispatch({ type: ADD_NEWS, payload: res.data });
      newNews = res.data;
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
    return newNews;
  }, []);

  // Update News
  const updateNews = useCallback(async news => {
    let newNews = null;
    dispatch({ type: SET_NEWSES_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/newses/newses/${news._id}`,
        news,
        config
      );
      dispatch({ type: UPDATE_NEWS, payload: res.data });
      newNews = res.data;
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
    return newNews;
  }, []);

  // Clear Newses Error
  const clearNewsesErrors = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSES_ERRORS });
  }, []);

  // Get Newses in Order
  const getNewsesInOrder = useCallback(async _ => {
    dispatch({ type: SET_NEWSES_IN_ORDER_LOADING });
    try {
      const res = await axios.get('/api/backend/newses/newsesInOrder');
      dispatch({ type: GET_NEWSES_IN_ORDER, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
  }, []);

  // Clear Newses in Order
  const clearNewsesInOrder = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSES_IN_ORDER });
  }, []);

  // Order Newses
  const orderNewses = useCallback(async newses => {
    let isSuccess = false;
    dispatch({ type: SET_NEWSES_IN_ORDER_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      await axios.post('/api/backend/newses/newsesInOrder', { newses }, config);
      dispatch({ type: ORDER_NEWSES });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, NEWSES_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  return (
    <NewsesContext.Provider
      value={{
        newses: state.newses,
        newsesPaginationMeta: state.newsesPaginationMeta,
        news: state.news,
        newsesErrors: state.newsesErrors,
        newsesLoading: state.newsesLoading,
        newsesInOrder: state.newsesInOrder,
        newsesInOrderLoading: state.newsesInOrderLoading,
        getNewses,
        clearNewses,
        getNews,
        clearNews,
        addNews,
        updateNews,
        clearNewsesErrors,
        getNewsesInOrder,
        clearNewsesInOrder,
        orderNewses
      }}
    >
      {children}
    </NewsesContext.Provider>
  );
};

export default NewsesState;
