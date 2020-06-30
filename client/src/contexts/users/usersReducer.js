import {
  GET_USERS,
  GET_USER,
  CLEAR_USER,
  ADD_USER,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_USERS,
  CLEAR_FILTER_USERS,
  USERS_ERRORS,
  CLEAR_USERS_ERRORS,
  SET_USERS_LOADING,
  EDIT_USER_PASSWORD,
  USER_PASSWORD_ERRORS,
  SET_USER_PASSWORD_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        usersLoading: false
      };
    case CLEAR_USERS:
      return {
        ...state,
        users: null,
        filteredUsers: null,
        usersErrors: null
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        usersLoading: false
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null
      };
    case ADD_USER:
      return {
        ...state,
        usersLoading: false
      };
    case UPDATE_USER:
      return {
        ...state,
        usersLoading: false
      };
    case FILTER_USERS:
      return {
        ...state,
        filteredUsers: state.users.filter(user => {
          const regex = new RegExp(action.payload, 'gi');
          return user.name.match(regex) || user.email.match(regex);
        })
      };
    case CLEAR_FILTER_USERS:
      return {
        ...state,
        filteredUsers: null
      };
    case USERS_ERRORS:
      return {
        ...state,
        usersErrors: action.payload
      };
    case CLEAR_USERS_ERRORS:
      return {
        ...state,
        usersErrors: null
      };
    case SET_USERS_LOADING:
      return {
        ...state,
        usersLoading: true
      };
    default:
      return state;
  }
};
