import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_AUTH_ERROR
} from '../types';
import { isAdmin } from 'types/userRoles';

const initialState = {
  authToken: localStorage.getItem('token'),
  isAuthenticated: null,
  authLoading: true,
  authUser: null,
  authError: null
};

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = useCallback(async _ => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  }, []);

  // Login User
  const login = useCallback(
    async formData => {
      const config = {
        header: {
          'Content-Type': 'application.json'
        }
      };

      try {
        const res = await axios.post('/api/auth', formData, config);

        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });

        loadUser();
      } catch (err) {
        dispatch({
          type: LOGIN_FAIL,
          payload: err.response.data.type
        });
      }
    },
    [loadUser]
  );

  // Logout
  const logout = useCallback(_ => {
    dispatch({ type: LOGOUT });
  }, []);

  // Clear Error
  const clearAuthError = useCallback(_ => {
    dispatch({ type: CLEAR_AUTH_ERROR });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        authLoading: state.authLoading,
        authUser: state.authUser,
        authError: state.authError,
        isAuthUserAdmin: state.authUser ? isAdmin(state.authUser) : false,
        loadUser,
        login,
        logout,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
