import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import PageMetaMiscellaneousContext from './pageMetaMiscellaneousContext';
import pageMetaMiscellaneousReducer from './pageMetaMiscellaneous';
import handleServerError from '../handleServerError';
import {
  GET_PAGE_META_MISCELLANEOUS,
  CLEAR_PAGE_META_MISCELLANEOUS,
  UPDATE_PAGE_META_MISCELLANEOUS,
  PAGE_META_MISCELLANEOUS_ERRORS,
  CLEAR_PAGE_META_MISCELLANEOUS_ERRORS,
  SET_PAGE_META_MISCELLANEOUS_LOADING
} from '../types';

const initialState = {
  pageMetaMiscellaneous: null,
  pageMetaMiscellaneousErrors: null,
  pageMetaMiscellaneousLoading: false
};

const PageMetaMiscellaneousState = ({ children }) => {
  const [state, dispatch] = useReducer(
    pageMetaMiscellaneousReducer,
    initialState
  );

  // Get Page Meta Miscellaneous
  const getPageMetaMiscellaneous = useCallback(async _ => {
    dispatch({ type: SET_PAGE_META_MISCELLANEOUS_LOADING });
    try {
      const res = await axios.get(
        '/api/backend/pageMetaMiscellaneous/pageMetaMiscellaneous'
      );
      dispatch({ type: GET_PAGE_META_MISCELLANEOUS, payload: res.data });
    } catch (err) {
      handleServerError(err, PAGE_META_MISCELLANEOUS_ERRORS, dispatch);
    }
  }, []);

  // Clear Page Meta Miscellaneous
  const clearPageMetaMiscellaneous = useCallback(_ => {
    dispatch({ type: CLEAR_PAGE_META_MISCELLANEOUS });
  }, []);

  // Update Page Meta Miscellaneous
  const updatePageMetaMiscellaneous = useCallback(
    async pageMetaMiscellaneous => {
      let newPageMetaMiscellaneous = null;
      dispatch({ type: SET_PAGE_META_MISCELLANEOUS_LOADING });
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      try {
        const res = await axios.post(
          '/api/backend/pageMetaMiscellaneous/pageMetaMiscellaneous',
          pageMetaMiscellaneous,
          config
        );
        dispatch({ type: UPDATE_PAGE_META_MISCELLANEOUS, payload: res.data });
        newPageMetaMiscellaneous = res.data;
      } catch (err) {
        handleServerError(err, PAGE_META_MISCELLANEOUS_ERRORS, dispatch);
      }
      return newPageMetaMiscellaneous;
    },
    []
  );

  // Clear Page Meta Miscellaneous Errors
  const clearPageMetaMiscellaneousErrors = useCallback(_ => {
    dispatch({ type: CLEAR_PAGE_META_MISCELLANEOUS_ERRORS });
  }, []);

  return (
    <PageMetaMiscellaneousContext.Provider
      value={{
        pageMetaMiscellaneous: state.pageMetaMiscellaneous,
        pageMetaMiscellaneousErrors: state.pageMetaMiscellaneousErrors,
        pageMetaMiscellaneousLoading: state.pageMetaMiscellaneousLoading,
        getPageMetaMiscellaneous,
        clearPageMetaMiscellaneous,
        updatePageMetaMiscellaneous,
        clearPageMetaMiscellaneousErrors
      }}
    >
      {children}
    </PageMetaMiscellaneousContext.Provider>
  );
};

export default PageMetaMiscellaneousState;
