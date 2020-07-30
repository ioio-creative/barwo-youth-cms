import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import SenderContext from './senderContext';
import senderReducer from './senderReducer';
import handleServerError from '../handleServerError';
import {
  GET_SENDER,
  CLEAR_SENDER,
  UPDATE_SENDER,
  SENDER_ERRORS,
  CLEAR_SENDER_ERRORS,
  SET_SENDER_LOADING
} from '../types';

const initialState = {
  sender: null,
  senderErrors: null,
  senderLoading: false
};

const SenderState = ({ children }) => {
  const [state, dispatch] = useReducer(senderReducer, initialState);

  // Get Sender
  const getSender = useCallback(async _ => {
    dispatch({ type: SET_SENDER_LOADING });
    try {
      const res = await axios.get('/api/backend/sender/sender');
      dispatch({ type: GET_SENDER, payload: res.data });
      // console.log(res.data);
    } catch (err) {
      handleServerError(err, SENDER_ERRORS, dispatch);
    }
  }, []);

  // Clear Sender
  const clearSender = useCallback(_ => {
    dispatch({ type: CLEAR_SENDER });
  }, []);

  // Update Sender
  const updateSender = useCallback(async sender => {
    let newSender = null;
    dispatch({ type: SET_SENDER_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/sender/sender',
        sender,
        config
      );
      dispatch({ type: UPDATE_SENDER, payload: res.data });
      newSender = res.data;
    } catch (err) {
      handleServerError(err, SENDER_ERRORS, dispatch);
    }
    return newSender;
  }, []);

  // Clear Sender Error
  const clearSenderErrors = useCallback(_ => {
    dispatch({ type: CLEAR_SENDER_ERRORS });
  }, []);

  return (
    <SenderContext.Provider
      value={{
        sender: state.sender,
        senderErrors: state.senderErrors,
        senderLoading: state.senderLoading,
        getSender,
        clearSender,
        updateSender,
        clearSenderErrors
      }}
    >
      {children}
    </SenderContext.Provider>
  );
};

export default SenderState;
