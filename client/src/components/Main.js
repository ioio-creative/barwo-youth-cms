import React, { useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import TitlebarState from 'contexts/titlebar/TitlebarState';
import AuthContext from 'contexts/auth/authContext';
import asyncLoadingComponent from 'components/asyncLoading/AsyncLoadingComponent';
import Navbar from 'components/layout/Navbar';
import Titlebar from 'components/layout/Titlebar';
import Alerts from 'components/layout/Alerts';
import routes from 'globals/routes';
import './Main.css';

/* async react components */
const AsyncHome = asyncLoadingComponent(_ => import('components/pages/Home'));
const AsyncUserList = asyncLoadingComponent(_ =>
  import('components/pages/UserList')
);
const AsyncUserEdit = asyncLoadingComponent(_ =>
  import('components/pages/UserEdit')
);

const Main = _ => {
  const { loadUser } = useContext(AuthContext);
  // componentDidMount
  useEffect(_ => {
    loadUser();
    // eslint-disable-next-line
  }, []);
  return (
    <div className='main'>
      <Navbar className='my-navbar' />
      <TitlebarState>
        <div className='my-main'>
          <Titlebar />
          <div className='w3-container'>
            <Alerts />
            <Switch>
              <Route exact path={routes.home(false)} component={AsyncHome} />
              <Route
                exact
                path={routes.userList(false)}
                component={AsyncUserList}
              />
              <Route
                exact
                path={routes.userEditById}
                component={AsyncUserEdit}
              />
              <Route
                exact
                path={routes.userAddById}
                component={AsyncUserEdit}
              />
              <Route component={AsyncHome} />
            </Switch>
          </div>
        </div>
      </TitlebarState>
    </div>
  );
};

export default Main;
