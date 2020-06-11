import React, { useReducer, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT, REMOVE_ALERTS } from '../types';

const initialState = [];

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = useCallback((msg, type, timeout = -1) => {
    const _id = uuid();
    dispatch({ type: SET_ALERT, payload: { msg, type, _id } });

    if (timeout >= 0) {
      setTimeout(_ => dispatch({ type: REMOVE_ALERT, payload: _id }), timeout);
    }

    return _id;
  }, []);

  // Remove Alert
  const removeAlert = useCallback(_id => {
    dispatch({ type: REMOVE_ALERT, payload: _id });
  }, []);

  // Remove Alerts
  const removeAlerts = useCallback(_ => {
    dispatch({ type: REMOVE_ALERTS });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
        removeAlert,
        removeAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
