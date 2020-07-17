import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import SendHistoryContext from './sendHistoriesContext';
import sendHistoryReducer from './sendHistoriesReducer';
import SendHistory from 'models/sendHistory';
import handleServerError from '../handleServerError';
import {
  GET_SENDHISTORIES,
  GET_SENDHISTORY,
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
  const [state, dispatch] = useReducer(sendHistoryReducer, initialState);

  // Get SendHistories
  const getSendHistories = useCallback(async options => {
    dispatch({ type: SET_SENDHISTORIES_LOADING });
    let url = '/api/backend/sendHistories/sendHistories';
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
      handleServerError(err, SENDHISTORIES_ERRORS, dispatch);
    }
  }, []);

  // Get SendHistory
  const getSendHistory = useCallback(async sendHistoryId => {
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
        `/api/backend/sendHistories/sendHistories/${sendHistoryId}`
      );
      dispatch({ type: GET_SENDHISTORY, payload: res.data });
    } catch (err) {
      handleServerError(err, SENDHISTORIES_ERRORS, dispatch);
    }
  }, []);

  // Clear Newsletters Error
  const clearSendHistoriesErrors = useCallback(_ => {
    dispatch({ type: CLEAR_SENDHISTORIES_ERRORS });
  }, []);

  return (
    <SendHistoryContext.Provider
      value={{
        sendHistories: state.sendHistories,
        sendHistoriesPaginationMeta: state.sendHistoriesPaginationMeta,
        sendHistory: state.sendHistory,
        sendHistoriesErrors: state.sendHistoriesErrors,
        getSendHistories,
        getSendHistory,
        clearSendHistoriesErrors
      }}
    >
      {children}
    </SendHistoryContext.Provider>
  );
};

export default SendHistoriesState;
