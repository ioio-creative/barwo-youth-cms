import React, { useState, useContext, useEffect, useRef } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import Alerts from 'components/layout/Alerts';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import authResponseTypes from 'types/responses/auth';
import alertTypes from 'types/alertTypes';
import { goToUrl } from 'utils/history';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import './Login.css';

const Login = _ => {
  const { setAlert } = useContext(AlertContext);
  const {
    login,
    isAuthenticated,
    authError,
    authLoading,
    clearAuthError,
    removeAuthLoading
  } = useContext(AuthContext);

  // componentDidMount
  useEffect(
    _ => {
      removeAuthLoading();
      // test
      //setAlert('XXXXXXXXXX lsjgfa;sdjgl jads;lgkads', alertTypes.WARNING);
    },
    [removeAuthLoading]
  );

  useEffect(
    _ => {
      if (isAuthenticated) {
        goToUrl(routes.home);
      }
    },
    [isAuthenticated]
  );

  useEffect(
    _ => {
      if (authError) {
        setAlert(authResponseTypes[authError].msg, alertTypes.WARNING);
        clearAuthError();
      }
    },
    [authError, setAlert, clearAuthError]
  );

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert(uiWordings['Login.FillInAllFieldsMessage'], alertTypes.WARNING);
    } else {
      await login({
        email,
        password
      });
      goToUrl(routes.home(true));
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className='login'>
      <div className='w3-content form-container'>
        <form
          className='w3-card-4 w3-light-grey w3-text-blue w3-margin'
          onSubmit={onSubmit}
        >
          <div className='w3-container'>
            <h2 className='w3-center'>{uiWordings['Login.Title']}</h2>
            <Alerts />
            <LabelInputTextPair
              name='email'
              value={email}
              inputType='email'
              labelMessage={uiWordings['Login.EmailLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
            />
            <LabelInputTextPair
              name='password'
              value={password}
              inputType='password'
              labelMessage={uiWordings['Login.PasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
            />
            <div className='w3-center'>
              <SubmitButton label={uiWordings['Login.LoginButton']} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
