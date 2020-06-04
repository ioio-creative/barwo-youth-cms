import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !authLoading ? (
          <Redirect to={routes.login(false)} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
