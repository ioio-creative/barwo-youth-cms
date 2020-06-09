import React, { useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthContext from 'contexts/auth/authContext';
import asyncLoadingComponent from 'components/asyncLoading/AsyncLoadingComponent';
import Navbar from 'components/layout/Navbar';
import routes from 'globals/routes';
import './Main.css';

/* async react components */
const AsyncHome = asyncLoadingComponent(_ => import('components/pages/Home'));
const AsyncUsers = asyncLoadingComponent(_ => import('components/pages/Users'));

const Main = _ => {
  const { loadUser } = useContext(AuthContext);
  useEffect(_ => {
    loadUser();
    // eslint-disable-next-line
  }, []);
  return (
    <div className='main'>
      <Navbar className='my-navbar' />
      <div className='my-main'>
        <Switch>
          <Route exact path={routes.home(false)} component={AsyncHome} />
          <Route exact path={routes.users(false)} component={AsyncUsers} />
          <Route component={AsyncHome} />
        </Switch>
      </div>
    </div>
  );
};

export default Main;
