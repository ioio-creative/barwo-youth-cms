import React, { useState, useContext, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import Alert from 'models/alert';
import Alerts from 'components/layout/Alerts';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import authResponseTypes from 'types/responses/auth';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import './Login.css';

const Login = _ => {
  const { setAlerts /*, removeAlerts*/ } = useContext(AlertContext);
  const {
    login,
    isAuthenticated,
    authErrors,
    authLoading,
    clearAuthErrors,
    removeAuthLoading
  } = useContext(AuthContext);

  // componentDidMount
  useEffect(_ => {
    removeAuthLoading();
    // test
    //setAlerts(new Alert('XXXXXXXXXX lsjgfa;sdjgl jads;lgkads', Alert.alertTypes.WARNING));
    console.log('Login componentDidMount');
    return _ => {
      console.log('Login componentWillUnmount');
      // !!!Importanta!!! should not call removeAlerts here
      // as Login will always unmount on submit
      //removeAlerts();
    };
    // eslint-disable-next-line
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
      if (isNonEmptyArray(authErrors)) {
        setAlerts(
          authErrors.map(authError => {
            return new Alert(
              authResponseTypes[authError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearAuthErrors();
      }
    },
    [authErrors, setAlerts, clearAuthErrors]
  );

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = useCallback(
    e => {
      setUser({
        ...user,
        [e.target.name]: e.target.value
      });
    },
    [user, setUser]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      if (email === '' || password === '') {
        setAlerts(
          new Alert(
            uiWordings['Login.FillInAllFieldsMessage'],
            Alert.alertTypes.WARNING
          )
        );
      } else {
        await login({
          email,
          password
        });
        goToUrl(routes.home(true));
      }
    },
    [email, password, setAlerts, login]
  );

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
