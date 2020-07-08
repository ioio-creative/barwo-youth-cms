import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import TicketingDefaultContext from './ticketingDefaultContext';
import ticketingDefaultReducer from './ticketingDefaultReducer';
import handleServerError from '../handleServerError';
import {
  GET_TICKETING_DEFAULT,
  CLEAR_TICKETING_DEFAULT,
  UPDATE_TICKETING_DEFAULT,
  TICKETING_DEFAULT_ERRORS,
  CLEAR_TICKETING_DEFAULT_ERRORS,
  SET_TICKETING_DEFAULT_LOADING
} from '../types';

const initialState = {
  ticketingDefault: null,
  ticketingDefaultErrors: null,
  ticketingDefaultLoading: false
};

const TicketingDefaultState = ({ children }) => {
  const [state, dispatch] = useReducer(ticketingDefaultReducer, initialState);

  // Get Global Constants
  const getTicketingDefault = useCallback(async _ => {
    dispatch({ type: SET_TICKETING_DEFAULT_LOADING });
    try {
      const res = await axios.get('/api/backend/events/ticketingDefault');
      dispatch({ type: GET_TICKETING_DEFAULT, payload: res.data });
    } catch (err) {
      handleServerError(err, TICKETING_DEFAULT_ERRORS, dispatch);
    }
  }, []);

  // Clear Global Constants
  const clearTicketingDefault = useCallback(_ => {
    dispatch({ type: CLEAR_TICKETING_DEFAULT });
  }, []);

  // Update Global Constants
  const updateTicketingDefault = useCallback(async ticketingDefault => {
    let newTicketingDefault = null;
    dispatch({ type: SET_TICKETING_DEFAULT_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/backend/events/ticketingDefault',
        ticketingDefault,
        config
      );
      dispatch({ type: UPDATE_TICKETING_DEFAULT, payload: res.data });
      newTicketingDefault = res.data;
      console.log(res.data);
    } catch (err) {
      handleServerError(err, TICKETING_DEFAULT_ERRORS, dispatch);
    }
    return newTicketingDefault;
  }, []);

  // Clear Global Constants Error
  const clearTicketingDefaultErrors = useCallback(_ => {
    dispatch({ type: CLEAR_TICKETING_DEFAULT_ERRORS });
  }, []);

  return (
    <TicketingDefaultContext.Provider
      value={{
        ticketingDefault: state.ticketingDefault,
        ticketingDefaultErrors: state.ticketingDefaultErrors,
        getTicketingDefault,
        clearTicketingDefault,
        updateTicketingDefault,
        clearTicketingDefaultErrors
      }}
    >
      {children}
    </TicketingDefaultContext.Provider>
  );
};

export default TicketingDefaultState;
