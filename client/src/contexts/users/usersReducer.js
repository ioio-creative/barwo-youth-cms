import {
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_USERS,
  CLEAR_FILTER_USERS,
  USERS_ERROR,
  CLEAR_USERS_ERROR,
  SET_USERS_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        usersLoading: false
      };
    case ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
        //currentUserToEdit: null,
        usersLoading: false
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        //currentUserToEdit: null,
        usersLoading: false
      };
    case CLEAR_USERS:
      return {
        ...state,
        users: null,
        filteredUsers: null,
        usersError: null,
        currentUserToEdit: null
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
    case USERS_ERROR:
      return {
        ...state,
        usersError: action.payload
      };
    case CLEAR_USERS_ERROR:
      return {
        ...state,
        usersError: null
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
