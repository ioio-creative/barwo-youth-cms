import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import GlobalConstantsContext from './globalConstantsContext';
import globalConstantsReducer from './globalConstantsReducer';
import handleServerError from '../handleServerError';
import {
  GET_GLOBAL_CONSTANTS,
  CLEAR_GLOBAL_CONSTANTS,
  UPDATE_GLOBAL_CONSTANTS,
  GLOBAL_CONSTANTS_ERRORS,
  CLEAR_GLOBAL_CONSTANTS_ERRORS,
  SET_GLOBAL_CONSTANTS_LOADING
} from '../types';

const initialState = {
  globalConstants: null,
  globalConstantsErrors: null,
  globalConstantsLoading: false
};

const GlobalConstantsState = ({ children }) => {
  const [state, dispatch] = useReducer(globalConstantsReducer, initialState);

  // Get Global Constants
  const getGlobalConstants = useCallback(async _ => {
    dispatch({ type: SET_GLOBAL_CONSTANTS_LOADING });
    try {
      const res = await axios.get(
        '/api/backend/globalConstants/globalConstants'
      );
      dispatch({ type: GET_GLOBAL_CONSTANTS, payload: res.data });
    } catch (err) {
      handleServerError(err, GLOBAL_CONSTANTS_ERRORS, dispatch);
    }
  }, []);

  // Clear Global Constants
  const clearGlobalConstants = useCallback(_ => {
    dispatch({ type: CLEAR_GLOBAL_CONSTANTS });
  }, []);

  // Update Global Constants
  const updateGlobalConstants = useCallback(async globalConstants => {
    let newGlobalConstants = null;
    dispatch({ type: SET_GLOBAL_CONSTANTS_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/globalConstants/globalConstants',
        globalConstants,
        config
      );
      dispatch({ type: UPDATE_GLOBAL_CONSTANTS, payload: res.data });
      newGlobalConstants = res.data;
    } catch (err) {
      handleServerError(err, GLOBAL_CONSTANTS_ERRORS, dispatch);
    }
    return newGlobalConstants;
  }, []);

  // Clear Global Constants Error
  const clearGlobalConstantsErrors = useCallback(_ => {
    dispatch({ type: CLEAR_GLOBAL_CONSTANTS_ERRORS });
  }, []);

  return (
    <GlobalConstantsContext.Provider
      value={{
        globalConstants: state.globalConstants,
        globalConstantsErrors: state.globalConstantsErrors,
        getGlobalConstants,
        clearGlobalConstants,
        updateGlobalConstants,
        clearGlobalConstantsErrors
      }}
    >
      {children}
    </GlobalConstantsContext.Provider>
  );
};

export default GlobalConstantsState;
