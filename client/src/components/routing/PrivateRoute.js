import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, authLoading } = useContext(AuthContext);

  const isRedirectToLogin = useMemo(
    _ => {
      return !isAuthenticated && !authLoading;
    },
    [isAuthenticated, authLoading]
  );

  useEffect(
    _ => {
      if (isRedirectToLogin) {
        console.log('PrivateRoute: redirect to login');
      }
    },
    [isRedirectToLogin]
  );

  return (
    <Route
      {...rest}
      render={props =>
        isRedirectToLogin ? (
          <Redirect to={routes.login(false)} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
