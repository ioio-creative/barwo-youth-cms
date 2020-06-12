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

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        authLoading: false,
        authUser: action.payload
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        authLoading: false
      };
    case AUTH_ERRORS:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        authToken: null,
        isAuthenticated: false,
        authLoading: false,
        authUser: null,
        authErrors: action.payload
      };
    case CLEAR_AUTH_ERRORS:
      return {
        ...state,
        authErrors: null
      };
    case SET_AUTH_LOADING:
      return {
        ...state,
        authLoading: true
      };
    case REMOVE_AUTH_LOADING:
      return {
        ...state,
        authLoading: false
      };
    default:
      return state;
  }
};
