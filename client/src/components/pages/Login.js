import React, { useState, useContext, useEffect } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import Alerts from 'components/layout/Alerts';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import authResponseTypes from 'types/responses/auth';
import alertTypes from 'types/alertTypes';
import { goToUrl } from 'utils/history';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import './Login.css';

const Login = _ => {
  const { setAlert, removeAlerts } = useContext(AlertContext);
  const {
    login,
    isAuthenticated,
    authError,
    authLoading,
    clearAuthError,
    removeAuthLoading
  } = useContext(AuthContext);

  // componentDidMount
  useEffect(_ => {
    removeAuthLoading();
    // test
    //setAlert('XXXXXXXXXX lsjgfa;sdjgl jads;lgkads', alertTypes.WARNING);

    return _ => {
      removeAlerts();
    };
  }, []);

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
        console.log(authError);
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

  return (
    <div className='login-page'>
      {authLoading ? (
        <Loading />
      ) : (
        <div className='w3-content form-container'>
          <Form onSubmit={onSubmit} isCard={true}>
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
              isHalf={false}
            />
            <LabelInputTextPair
              name='password'
              value={password}
              inputType='password'
              labelMessage={uiWordings['Login.PasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              isHalf={false}
            />
            <div className='w3-center'>
              <SubmitButton label={uiWordings['Login.LoginButton']} />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Login;
