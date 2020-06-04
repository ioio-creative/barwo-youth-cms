import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_AUTH_ERROR
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
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        authToken: null,
        isAuthenticated: false,
        authLoading: false,
        authUser: null,
        authError: action.payload
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
};
