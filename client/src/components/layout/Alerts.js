import React, { useContext } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Alerts = _ => {
  const { alerts } = useContext(AlertContext);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <>
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          <FontAwesomeIcon icon='info-circle' /> {alert.msg}
        </div>
      ))}
    </>
  );
};

export default Alerts;
