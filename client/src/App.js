import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { Fonts, GlobalStyle } from '@buffetjs/styles';
import { ReactRouterGlobalHistory } from 'react-router-global-history';
import AlertState from 'contexts/alert/AlertState';
import AuthState from 'contexts/auth/AuthState';
import PrivateRoute from 'components/routing/PrivateRoute';
/**
 * !!! Obsolete !!! as I have already migrated from react-loadable to React.Suspense (https://objectpartners.com/2018/12/05/migrate-from-react-loadable-to-react-suspense/)
 * Would get the following warning if putting result of asyncLoadingComponent(_ => import('components/Main')) into PrivateRoute.
 * So I don't async load Main. 
 * 
 * Warning: Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: LoadableComponent

Learn more about this warning here: https://fb.me/react-legacy-context
 */
import Main from 'components/Main';
import asyncLoadingComponent from 'components/asyncLoading/AsyncLoadingComponent';
import routes from 'globals/routes';
import setAuthToken from 'utils/setAuthToken';
import './App.css';

/* async react components */
const AsyncLogin = asyncLoadingComponent(_ => import('components/pages/Login'));

/* set auth token to determine if it's logged in */
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = _ => {
  return (
    <div className='barwo-youth-cms'>
      <Fonts />
      <GlobalStyle />
      <AuthState>
        <AlertState>
          <Router>
            <QueryParamProvider>
              <ReactRouterGlobalHistory />
              <Switch>
                <Route
                  exact
                  path={routes.login(false)}
                  component={AsyncLogin}
                />
                <PrivateRoute component={Main} />
              </Switch>
            </QueryParamProvider>
          </Router>
        </AlertState>
      </AuthState>
    </div>
  );
};

export default App;
