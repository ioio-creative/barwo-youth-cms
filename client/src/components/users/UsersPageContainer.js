import React, { useContext, useRef, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import UsersState from 'contexts/users/UsersState';
import uiWordings from 'globals/uiWordings';
import alertTypes from 'types/alertTypes';

const UsersPageContainer = ({ children }) => {
  const { setAlert, removeAlert } = useContext(AlertContext);
  const { isAuthUserAdmin, authLoading } = useContext(AuthContext);
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  const alertId = useRef(null);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Users.Title']);
    return _ => {
      removeTitle();
      clearAlert();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (!isAuthUserAdmin && !authLoading) {
        if (!alertId.current) {
          alertId.current = setAlert(
            uiWordings['Users.ForbiddenAccessMessage'],
            alertTypes.WARNING,
            -1
          );
        }
      } else {
        clearAlert();
      }
    },
    [isAuthUserAdmin, authLoading]
  );

  /* methods */

  const clearAlert = useCallback(
    _ => {
      if (alertId.current) {
        removeAlert(alertId.current);
        alertId.current = null;
      }
    },
    [alertId, removeAlert]
  );

  /* end of methods */

  if (!isAuthUserAdmin) {
    return null;
  }

  return (
    <UsersState>
      <div className='users-page-container'>
        <div className='w3-container'>{children}</div>
      </div>
    </UsersState>
  );
};

export default UsersPageContainer;
