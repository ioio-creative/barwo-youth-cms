import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const initialState = [];

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuid();
    dispatch({ type: SET_ALERT, payload: { msg, type, id } });

    setTimeout(_ => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
