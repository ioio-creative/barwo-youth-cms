import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import AboutContext from './aboutContext';
import aboutReducer from './aboutReducer';
import handleServerError from '../handleServerError';
import {
  GET_ABOUT,
  CLEAR_ABOUT,
  UPDATE_ABOUT,
  ABOUT_ERRORS,
  CLEAR_ABOUT_ERRORS,
  SET_ABOUT_LOADING
} from '../types';

const initialState = {
  about: null,
  aboutErrors: null,
  aboutLoading: false
};

const AboutState = ({ children }) => {
  const [state, dispatch] = useReducer(aboutReducer, initialState);

  // Get About
  const getAbout = useCallback(async _ => {
    dispatch({ type: SET_ABOUT_LOADING });
    try {
      const res = await axios.get('/api/backend/about/about');
      dispatch({ type: GET_ABOUT, payload: res.data });
      // console.log(res.data);
    } catch (err) {
      handleServerError(err, ABOUT_ERRORS, dispatch);
    }
  }, []);

  // Clear About
  const clearAbout = useCallback(_ => {
    dispatch({ type: CLEAR_ABOUT });
  }, []);

  // Update About
  const updateAbout = useCallback(async about => {
    let newAbout = null;
    dispatch({ type: SET_ABOUT_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/backend/about/about', about, config);
      dispatch({ type: UPDATE_ABOUT, payload: res.data });
      newAbout = res.data;
    } catch (err) {
      handleServerError(err, ABOUT_ERRORS, dispatch);
    }
    return newAbout;
  }, []);

  // Clear About Error
  const clearAboutErrors = useCallback(_ => {
    dispatch({ type: CLEAR_ABOUT_ERRORS });
  }, []);

  return (
    <AboutContext.Provider
      value={{
        about: state.about,
        aboutErrors: state.aboutErrors,
        getAbout,
        clearAbout,
        updateAbout,
        clearAboutErrors
      }}
    >
      {children}
    </AboutContext.Provider>
  );
};

export default AboutState;
