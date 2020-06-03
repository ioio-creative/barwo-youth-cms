import React, { useState, useContext, useEffect } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import AuthContext from 'contexts/auth/authContext';
import { INVALID_CREDENTIALS } from 'types/responses/auth';

const Login = ({ history }) => {
  const { setAlert } = useContext(AlertContext);
  const { login, isAuthenticated, error, clearErrors } = useContext(
    AuthContext
  );

  useEffect(
    _ => {
      if (isAuthenticated) {
        history.push('/');
      }

      if (error === INVALID_CREDENTIALS) {
        setAlert(error, 'danger');
        clearErrors();
      }
    },
    // eslint-disable-next-line
    [error, isAuthenticated, history]
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
      setAlert('Please fill in all fields', 'danger');
    } else {
      await login({
        email,
        password
      });
    }
  };

  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
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
