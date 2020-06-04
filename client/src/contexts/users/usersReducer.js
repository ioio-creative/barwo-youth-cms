import {
  GET_USERS,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT_USER_TO_EDIT,
  CLEAR_CURRENT_USER_TO_EDIT,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_USERS,
  CLEAR_FILTER_USERS,
  USERS_ERROR,
  CLEAR_USERS_ERROR
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
        currentUserToEdit: null,
        userLoading: false
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        currentUserToEdit: null,
        usersLoading: false
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload),
        currentUserToEdit:
          state.currentUserToEdit &&
          state.currentUserToEdit._id === action.payload
            ? null
            : state.currentUserToEdit,
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
    case SET_CURRENT_USER_TO_EDIT:
      return {
        ...state,
        currentUserToEdit: action.payload
      };
    case CLEAR_CURRENT_USER_TO_EDIT:
      return {
        ...state,
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
    default:
      return state;
  }
};
