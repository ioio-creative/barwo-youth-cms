import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import MiscellaneousInfoContext from './miscellaneousInfoContext';
import miscellaneousInfoReducer from './miscellaneousInfoReducer';
import handleServerError from '../handleServerError';
import {
  GET_MISCELLANEOUS_INFO,
  CLEAR_MISCELLANEOUS_INFO,
  UPDATE_MISCELLANEOUS_INFO,
  MISCELLANEOUS_INFO_ERRORS,
  CLEAR_MISCELLANEOUS_INFO_ERRORS,
  SET_MISCELLANEOUS_INFO_LOADING
} from '../types';

const initialState = {
  miscellaneousInfo: null,
  miscellaneousInfoErrors: null,
  miscellaneousInfoLoading: false
};

const MiscellaneousInfoState = ({ children }) => {
  const [state, dispatch] = useReducer(miscellaneousInfoReducer, initialState);

  // Get Miscellaneous Info
  const getMiscellaneousInfo = useCallback(async _ => {
    dispatch({ type: SET_MISCELLANEOUS_INFO_LOADING });
    try {
      const res = await axios.get(
        '/api/backend/miscellaneousInfo/miscellaneousInfo'
      );
      dispatch({ type: GET_MISCELLANEOUS_INFO, payload: res.data });
    } catch (err) {
      handleServerError(err, MISCELLANEOUS_INFO_ERRORS, dispatch);
    }
  }, []);

  // Clear Miscellaneous Info
  const clearMiscellaneousInfo = useCallback(_ => {
    dispatch({ type: CLEAR_MISCELLANEOUS_INFO });
  }, []);

  // Update Miscellaneous Info
  const updateMiscellaneousInfo = useCallback(async miscellaneousInfo => {
    let newMiscellaneousInfo = null;
    dispatch({ type: SET_MISCELLANEOUS_INFO_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/miscellaneousInfo/miscellaneousInfo',
        miscellaneousInfo,
        config
      );
      dispatch({ type: UPDATE_MISCELLANEOUS_INFO, payload: res.data });
      newMiscellaneousInfo = res.data;
    } catch (err) {
      handleServerError(err, MISCELLANEOUS_INFO_ERRORS, dispatch);
    }
    return newMiscellaneousInfo;
  }, []);

  // Clear Miscellaneous Info Errors
  const clearMiscellaneousInfoErrors = useCallback(_ => {
    dispatch({ type: CLEAR_MISCELLANEOUS_INFO_ERRORS });
  }, []);

  return (
    <MiscellaneousInfoContext.Provider
      value={{
        miscellaneousInfo: state.miscellaneousInfo,
        miscellaneousInfoErrors: state.miscellaneousInfoErrors,
        miscellaneousInfoLoading: state.miscellaneousInfoLoading,
        getMiscellaneousInfo,
        clearMiscellaneousInfo,
        updateMiscellaneousInfo,
        clearMiscellaneousInfoErrors
      }}
    >
      {children}
    </MiscellaneousInfoContext.Provider>
  );
};

export default MiscellaneousInfoState;
