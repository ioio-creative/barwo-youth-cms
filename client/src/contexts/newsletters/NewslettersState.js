import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import NewslettersContext from './newslettersContext';
import newslettersReducer from './newslettersReducer';
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
  DELETE_NEWSLETTER,
  SET_NEWSLETTERS_LOADING,
  SEND_NEWSLETTER
  // GET_NEWSLETTERS_IN_ORDER,
  // CLEAR_NEWSLETTERS_IN_ORDER,
  // ORDER_NEWSLETTERS,
  // SET_NEWSLETTERS_IN_ORDER_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  newsletters: null,
  newslettersPaginationMeta: null,
  newsletter: null,
  newslettersErrors: null,
  newslettersLoading: false
  // newslettersInOrder: null,
  // newslettersInOrderLoading: false
};

const NewslettersState = ({ children }) => {
  const [state, dispatch] = useReducer(newslettersReducer, initialState);

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
        payload: [
          Newsletter.newslettersResponseTypes.NEWSLETTER_NOT_EXISTS.type
        ]
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
      // console.log(res);
      dispatch({ type: ADD_NEWSLETTER, payload: res.data });
      // console.log(res.data);
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

  // Delete Newsletter
  const deleteNewsletter = useCallback(async newsletterId => {
    let isSuccess = false;
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    try {
      await axios.delete(
        `/api/backend/newsletters/newsletters/${newsletterId}`
      );
      dispatch({ type: DELETE_NEWSLETTER });
      isSuccess = true;
    } catch (err) {
      handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
    }
    return isSuccess;
  }, []);

  // Send newsletter
  const sendNewsletter = useCallback(async (newsletter, groups) => {
    let newNewsletter = null;
    console.log(groups);
    dispatch({ type: SET_NEWSLETTERS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    newsletter.groups = groups;
    try {
      const res = await axios.post(
        '/api/backend/newsletters/sendHistory',
        newsletter,
        config
      );
      dispatch({ type: SEND_NEWSLETTER, payload: res.data });

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

  // // Get Newsletters in Order
  // const getNewslettersInOrder = useCallback(async _ => {
  //   dispatch({ type: SET_NEWSLETTERS_IN_ORDER_LOADING });
  //   try {
  //     const res = await axios.get(
  //       '/api/backend/newsletters/newslettersInOrder'
  //     );
  //     dispatch({ type: GET_NEWSLETTERS_IN_ORDER, payload: res.data });
  //   } catch (err) {
  //     handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
  //   }
  // }, []);

  // // Clear Newsletters in Order
  // const clearNewslettersInOrder = useCallback(_ => {
  //   dispatch({ type: CLEAR_NEWSLETTERS_IN_ORDER });
  // }, []);

  // // Order Newsletters
  // const orderNewsletters = useCallback(async newsletters => {
  //   let isSuccess = false;
  //   dispatch({ type: SET_NEWSLETTERS_IN_ORDER_LOADING });
  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   };
  //   try {
  //     await axios.post(
  //       '/api/backend/newsletters/newslettersInOrder',
  //       { newsletters },
  //       config
  //     );
  //     dispatch({ type: ORDER_NEWSLETTERS });
  //     isSuccess = true;
  //   } catch (err) {
  //     handleServerError(err, NEWSLETTERS_ERRORS, dispatch);
  //   }
  //   return isSuccess;
  // }, []);

  return (
    <NewslettersContext.Provider
      value={{
        newsletters: state.newsletters,
        newslettersPaginationMeta: state.newslettersPaginationMeta,
        newsletter: state.newsletter,
        newslettersErrors: state.newslettersErrors,
        newslettersLoading: state.newslettersLoading,
        //newslettersInOrder: state.newslettersInOrder,
        //newslettersInOrderLoading: state.newslettersInOrderLoading,
        getNewsletters,
        clearNewsletters,
        getNewsletter,
        clearNewsletter,
        addNewsletter,
        updateNewsletter,
        deleteNewsletter,
        sendNewsletter,
        clearNewslettersErrors
        //getNewslettersInOrder,
        //clearNewslettersInOrder,
        //orderNewsletters
      }}
    >
      {children}
    </NewslettersContext.Provider>
  );
};

export default NewslettersState;
