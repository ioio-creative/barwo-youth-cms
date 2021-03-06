import React, { useReducer, useCallback, useRef } from 'react';
//import guid from 'utils/guid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERTS, REMOVE_ALERTS } from '../types';

const initialState = [];

const AlertState = ({ children }) => {
  const removeAlertsHandle = useRef(null);

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  // alerts is array of objects { msg, type }
  const setAlerts = useCallback((alerts, timeout = -1) => {
    //const _id = guid();

    const tamperedAlerts = Array.isArray(alerts) ? alerts : [alerts];
    dispatch({ type: SET_ALERTS, payload: tamperedAlerts });

    if (timeout >= 0) {
      removeAlertsHandle.current = setTimeout(_ => {
        dispatch({ type: REMOVE_ALERTS });
        if (removeAlertsHandle.current) {
          clearTimeout(removeAlertsHandle.current);
        }
      }, timeout);
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
