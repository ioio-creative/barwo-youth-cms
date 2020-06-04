import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ReactRouterGlobalHistory } from 'react-router-global-history';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faIdCardAlt,
  faEnvelopeOpen,
  faPhone,
  faInfoCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import AlertState from 'contexts/alert/AlertState';
import AuthState from 'contexts/auth/AuthState';
import PrivateRoute from 'components/routing/PrivateRoute';
import Navbar from 'components/layout/Navbar';
import Alerts from 'components/layout/Alerts';
/**
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

/* load font-awesome icons */
// https://github.com/FortAwesome/react-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently
library.add(faIdCardAlt, faEnvelopeOpen, faPhone, faInfoCircle, faSignOutAlt);

/* set auth token to determine if it's logged in */
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = _ => {
  return (
    <AuthState>
      <AlertState>
        <Router>
          <ReactRouterGlobalHistory />
          <Navbar />
          <div className='container'>
            <Alerts />
            <Switch>
              <Route exact path={routes.login(false)} component={AsyncLogin} />
              <PrivateRoute component={Main} />
            </Switch>
          </div>
        </Router>
      </AlertState>
    </AuthState>
  );
};

export default App;
