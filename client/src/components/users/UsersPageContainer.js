import React, { useContext, useEffect } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import UsersState from 'contexts/users/UsersState';
import uiWordings from 'globals/uiWordings';
import alertTypes from 'types/alertTypes';

const UsersPageContainer = ({ children }) => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const { isAuthUserAdmin, authLoading } = useContext(AuthContext);
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Users.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (!isAuthUserAdmin && !authLoading) {
        setAlerts([
          {
            msg: uiWordings['Users.ForbiddenAccessMessage'],
            type: alertTypes.WARNING
          }
        ]);
      } else {
        removeAlerts();
      }
    },
    [isAuthUserAdmin, authLoading, setAlerts, removeAlerts]
  );

  if (!isAuthUserAdmin) {
    return null;
  }

  return (
    <UsersState>
      <div className='users-page-container'>{children}</div>
    </UsersState>
  );
};

export default UsersPageContainer;
