import React, { useState, useContext, useEffect } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import Loading from 'components/layout/loading/DefaultLoading';
import authResponseTypes from 'types/responses/auth';
import { goToUrl } from 'utils/history';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

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
        setAlert(authResponseTypes[authError].msg, 'danger');
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
      setAlert(uiWordings['Login.FillInAllFieldsMessage'], 'danger');
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
    <div className='form-container'>
      <h1>
        <span className='text-primary'>{uiWordings['Login.Title']}</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>{uiWordings['Login.EmailLabel']}</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>{uiWordings['Login.PasswordLabel']}</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input
          type='submit'
          value='Login'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Login;
