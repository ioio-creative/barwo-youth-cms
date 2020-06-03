import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import setAuthToken from './utils/setAuthToken';
import './App.css';

// https://github.com/FortAwesome/react-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently
library.add(faIdCardAlt, faEnvelopeOpen, faPhone, faInfoCircle, faSignOutAlt);

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = _ => {
  return (
    <AuthState>
      <AlertState>
        <Router>
          <>
            <Navbar />
            <div className='container'>
              <Alerts />
              <Switch>
                <PrivateRoute exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </div>
          </>
        </Router>
      </AlertState>
    </AuthState>
  );
};

export default App;
