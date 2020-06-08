import React, { useContext } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import './Alerts.css';

const Alerts = _ => {
  const { alerts } = useContext(AlertContext);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <>
      {alerts.map(alert => {
        return (
          <div
            key={alert._id}
            className={`w3-panel w3-${alert.type.color} w3-padding w3-round-large w3-content`}
          >
            <i className='fa fa-info-circle' /> {alert.msg}
          </div>
        );
      })}
    </>
  );
};

export default Alerts;
