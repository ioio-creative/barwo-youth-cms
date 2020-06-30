import React, { useReducer, useCallback } from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
  USER_LOADED,
  AUTH_ERRORS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_AUTH_ERRORS,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING
} from '../types';
import handleServerError from '../handleServerError';
import User from 'models/user';

const initialState = {
  authToken: localStorage.getItem('token'),
  isAuthenticated: false,
  // authLoading has to be initially true to be used in PrivateRoute
  authLoading: true,
  authUser: null,
  authErrors: null
};

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = useCallback(async _ => {
    dispatch({ type: SET_AUTH_LOADING });

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/backend/auth/auth');
      console.log(res.data);
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      handleServerError(err, AUTH_ERRORS, dispatch);
    }
  }, []);

  // Login User
  const login = useCallback(
    async formData => {
      dispatch({ type: SET_AUTH_LOADING });

      const config = {
        header: {
          'Content-Type': 'application.json'
        }
      };

      try {
        const res = await axios.post(
          '/api/backend/auth/auth',
          formData,
          config
        );

        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });

        loadUser();
      } catch (err) {
        handleServerError(err, LOGIN_FAIL, dispatch);
      }
    },
    [loadUser]
  );

  // Logout
  const logout = useCallback(_ => {
    dispatch({ type: LOGOUT });
  }, []);

  // Clear Error
  const clearAuthErrors = useCallback(_ => {
    dispatch({ type: CLEAR_AUTH_ERRORS });
  }, []);

  // Remove Loading
  const removeAuthLoading = useCallback(_ => {
    dispatch({ type: REMOVE_AUTH_LOADING });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        authLoading: state.authLoading,
        authUser: state.authUser,
        authErrors: state.authErrors,
        isAuthUserAdmin: state.authUser ? User.isAdmin(state.authUser) : false,
        loadUser,
        login,
        logout,
        clearAuthErrors,
        removeAuthLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
