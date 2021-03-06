import React, { useContext } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import './Alerts.css';

const Alerts = _ => {
  const { alerts } = useContext(AlertContext);

  if (!isNonEmptyArray(alerts)) {
    return null;
  }

  return (
    <>
      {alerts.map((alert, idx) => {
        const {
          msg,
          type: { color }
        } = alert;
        return (
          <div
            //key={msg || Date.now()}  // msg may be duplicated..
            key={idx}
            className={`w3-panel w3-${color} w3-padding w3-round-large`}
          >
            <i className='fa fa-info-circle' /> {msg}
          </div>
        );
      })}
    </>
  );
};

export default Alerts;
