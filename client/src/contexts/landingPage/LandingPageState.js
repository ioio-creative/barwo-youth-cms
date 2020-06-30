import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import LandingPageContext from './landingPageContext';
import landingPageReducer from './landingPageReducer';
import handleServerError from '../handleServerError';
import {
  GET_LANDING_PAGE,
  CLEAR_LANDING_PAGE,
  UPDATE_LANDING_PAGE,
  LANDING_PAGE_ERRORS,
  CLEAR_LANDING_PAGE_ERRORS,
  SET_LANDING_PAGE_LOADING
} from '../types';

const initialState = {
  landingPage: null,
  landingPageErrors: null,
  landingPageLoading: false
};

const LandingPageState = ({ children }) => {
  const [state, dispatch] = useReducer(landingPageReducer, initialState);

  // Get Landing Page
  const getLandingPage = useCallback(async _ => {
    dispatch({ type: SET_LANDING_PAGE_LOADING });
    try {
      const res = await axios.get('/api/backend/landingPage/landingPage');
      dispatch({ type: GET_LANDING_PAGE, payload: res.data });
    } catch (err) {
      handleServerError(err, LANDING_PAGE_ERRORS, dispatch);
    }
  }, []);

  // Clear Landing Page
  const clearLandingPage = useCallback(_ => {
    dispatch({ type: CLEAR_LANDING_PAGE });
  }, []);

  // Update Landing Page
  const updateLandingPage = useCallback(async landingPage => {
    let newLandingPage = null;
    dispatch({ type: SET_LANDING_PAGE_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/landingPage/landingPage',
        landingPage,
        config
      );
      dispatch({ type: UPDATE_LANDING_PAGE, payload: res.data });
      newLandingPage = res.data;
    } catch (err) {
      handleServerError(err, LANDING_PAGE_ERRORS, dispatch);
    }
    return newLandingPage;
  }, []);

  // Clear Landing Page Error
  const clearLandingPageErrors = useCallback(_ => {
    dispatch({ type: CLEAR_LANDING_PAGE_ERRORS });
  }, []);

  return (
    <LandingPageContext.Provider
      value={{
        landingPage: state.landingPage,
        landingPageErrors: state.landingPageErrors,
        getLandingPage,
        clearLandingPage,
        updateLandingPage,
        clearLandingPageErrors
      }}
    >
      {children}
    </LandingPageContext.Provider>
  );
};

export default LandingPageState;
