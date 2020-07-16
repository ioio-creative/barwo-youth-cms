import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import NewsletterContext from './newslettersContext';
import newsletterReducer from './newslettersReducer';
import Newsletter from 'models/newsletter';
import handleServerError from '../handleServerError';
import {
  GET_NEWSLETTERS,
  CLEAR_NEWSLETTERS,
  GET_NEWSLETTER,
  CLEAR_NEWSLETTER,
  ADD_NEWSLETTER,
  UPDATE_NEWSLETTER,
  NEWSLETTERS_ERRORS,
  CLEAR_NEWSLETTERS_ERRORS,
  SET_NEWSLETTERS_LOADING,
  SEND_NEWSLETTER
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  newsletters: null,
  newslettersPaginationMeta: null,
  newsletter: null,
  newslettersErrors: null,
  newslettersLoading: false
};

const NewslettersState = ({ children }) => {
  const [state, dispatch] = useReducer(newsletterReducer, initialState);

  // Get Newsletters
  const getNewsletters = useCallback(async options => {
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    let url = '/api/backend/newsletters/newsletters';
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
    try {
      const res = await axios.get(url + queryString);
      const { docs, ...meta } = res.data;
      const payload = {
        newsletters: docs,
        meta: meta
      };
      dispatch({ type: GET_NEWSLETTERS, payload: payload });
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
    }
  }, []);

  // Clear Newsletters
  const clearNewsletters = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSLETTERS });
  }, []);

  // Get Newsletter
  const getNewsletter = useCallback(async newsletterId => {
    if (!newsletterId) {
      dispatch({
        type: NEWSLETTERS_ERRORS,
        payload: [Newsletter.newsletterResponseTypes.NEWSLETTER_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/newsletters/newsletters/${newsletterId}`
      );
      dispatch({ type: GET_NEWSLETTER, payload: res.data });
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
    }
  }, []);

  // Clear Newsletter
  const clearNewsletter = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSLETTER });
  }, []);

  // Add Newsletter
  const addNewsletter = useCallback(async newsletter => {
    let newNewsletter = null;
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/newsletters/newsletters',
        newsletter,
        config
      );
      console.log(res);
      dispatch({ type: ADD_NEWSLETTER, payload: res.data });
      console.log(res.data);
      newNewsletter = res.data;
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
      console.error(err);
    }
    return newNewsletter;
  }, []);

  // Update Newsletter
  const updateNewsletter = useCallback(async newsletter => {
    let newNewsletter = null;
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.put(
        `/api/backend/newsletters/newsletters/${newsletter._id}`,
        newsletter,
        config
      );
      dispatch({ type: UPDATE_NEWSLETTER, payload: res.data });
      newNewsletter = res.data;
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
    }
    return newNewsletter;
  }, []);

  // Send newsletter
  const sendNewsletter = useCallback(async newsletter => {
    let newNewsletter = null;
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/newsletters/sendHistory',
        newsletter,
        config
      );
      console.log(res);
      dispatch({ type: SEND_NEWSLETTER, payload: res.data });
      console.log(res.data);
      newNewsletter = res.data;
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
      console.error(err);
    }
    return newNewsletter;
  }, []);

  // Clear Newsletters Error
  const clearNewslettersErrors = useCallback(_ => {
    dispatch({ type: CLEAR_NEWSLETTERS_ERRORS });
  }, []);

  return (
    <NewsletterContext.Provider
      value={{
        newsletters: state.newsletters,
        newslettersPaginationMeta: state.newslettersPaginationMeta,
        newsletter: state.newsletter,
        newslettersErrors: state.newslettersErrors,
        getNewsletters,
        clearNewsletters,
        getNewsletter,
        clearNewsletter,
        addNewsletter,
        updateNewsletter,
        sendNewsletter,
        clearNewslettersErrors
      }}
    >
      {children}
    </NewsletterContext.Provider>
  );
};

export default NewslettersState;
