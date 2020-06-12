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
  CLEAR_AUTH_ERROR,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING
} from '../types';
import User from 'models/user';

const initialState = {
  authToken: localStorage.getItem('token'),
  isAuthenticated: false,
  // authLoading has to be initially true to be used in PrivateRoute
  authLoading: true,
  authUser: null,
  authError: null
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
      const res = await axios.get('/api/auth');
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
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
        authError: state.authError,
        isAuthUserAdmin: state.authUser ? User.isAdmin(state.authUser) : false,
        loadUser,
        login,
        logout,
        clearAuthError,
        removeAuthLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
