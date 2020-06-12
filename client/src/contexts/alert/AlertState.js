import React, { useReducer, useCallback } from 'react';
//import { v4 as uuid } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERTS, REMOVE_ALERTS } from '../types';

const initialState = [];

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  // alerts is array of objects { msg, type }
  const setAlerts = useCallback((alerts, timeout = -1) => {
    //const _id = uuid();
    dispatch({ type: SET_ALERTS, payload: alerts });

    if (timeout >= 0) {
      setTimeout(_ => dispatch({ type: REMOVE_ALERTS }), timeout);
    }

    //return _id;
  }, []);

  // Remove Alerts
  const removeAlerts = useCallback(_ => {
    dispatch({ type: REMOVE_ALERTS });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlerts,
        removeAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
