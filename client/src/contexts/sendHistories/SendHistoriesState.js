import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import SendHistoriesContext from './sendHistoriesContext';
import sendHistoriesReducer from './sendHistoriesReducer';
import SendHistory from 'models/sendHistory';
import handleServerError from '../handleServerError';
import {
  GET_SENDHISTORIES,
  CLEAR_SENDHISTORIES,
  GET_SENDHISTORY,
  CLEAR_SENDHISTORY,
  SENDHISTORIES_ERRORS,
  CLEAR_SENDHISTORIES_ERRORS,
  SET_SENDHISTORIES_LOADING
} from '../types';
import { setQueryStringValues } from 'utils/queryString';

const initialState = {
  sendHistories: null,
  sendHistoriesPaginationMeta: null,
  sendHistory: null,
  sendHistoriesErrors: null,
  sendHistoriesLoading: false
};

const SendHistoriesState = ({ children }) => {
  const [state, dispatch] = useReducer(sendHistoriesReducer, initialState);

  // Get SendHistories
  const getSendHistories = useCallback(async options => {
    // console.log('getSendHistories');
    dispatch({ type: SET_SENDHISTORIES_LOADING });
    let url = '/api/backend/newsletters/sendHistory';
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
        sendHistories: docs,
        meta: meta
      };
      dispatch({ type: GET_SENDHISTORIES, payload: payload });
    } catch (err) {
      // console.error(err);
      handleServerError(err, SENDHISTORIES_ERRORS, dispatch);
    }
  }, []);

  // Clear SendHistories
  const clearSendHistories = useCallback(_ => {
    dispatch({ type: CLEAR_SENDHISTORIES });
  }, []);

  // Get SendHistory
  const getSendHistory = useCallback(async sendHistoryId => {
    // console.log('getSendHistory');
    // console.log(sendHistoryId);
    if (!sendHistoryId) {
      dispatch({
        type: SENDHISTORIES_ERRORS,
        payload: [
          SendHistory.sendHistoryResponseTypes.SENDHISTORY_NOT_EXISTS.type
        ]
      });
      return;
    }
    dispatch({ type: SET_SENDHISTORIES_LOADING });
    try {
      const res = await axios.get(
        `/api/backend/newsletters/sendHistory/${sendHistoryId}`
      );
      dispatch({ type: GET_SENDHISTORY, payload: res.data });
    } catch (err) {
      console.log('catch');
      handleServerError(err, SENDHISTORIES_ERRORS, dispatch);
    }
  }, []);

  // Clear Send History
  const clearSendHistory = useCallback(_ => {
    dispatch({ type: CLEAR_SENDHISTORY });
  }, []);

  // Clear Send Histories Error
  const clearSendHistoriesErrors = useCallback(_ => {
    dispatch({ type: CLEAR_SENDHISTORIES_ERRORS });
  }, []);

  return (
    <SendHistoriesContext.Provider
      value={{
        sendHistories: state.sendHistories,
        sendHistoriesPaginationMeta: state.sendHistoriesPaginationMeta,
        sendHistory: state.sendHistory,
        sendHistoriesErrors: state.sendHistoriesErrors,
        sendHistoriesLoading: state.sendHistoriesLoading,
        getSendHistories,
        clearSendHistories,
        getSendHistory,
        clearSendHistory,
        clearSendHistoriesErrors
      }}
    >
      {children}
    </SendHistoriesContext.Provider>
  );
};

export default SendHistoriesState;
