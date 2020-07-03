import React, { useReducer, useCallback } from 'react';
//import guid from 'utils/guid';
import axios from 'axios';
import UsersContext from './usersContext';
import usersReducer from './usersReducer';
import User from 'models/user';
import handleServerError from '../handleServerError';
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

const initialState = {
  // users: [
  //   {
  //     _id: 1,
  //     type: 'professional',
  //     name: 'Sara Smith',
  //     email: 'ssmith@gmail.com',
  //     phone: '444-444-4444'
  //   },
  //   {
  //     _id: 2,
  //     type: 'personal',
  //     name: 'Ted Johnson',
  //     email: 'ted@gmail.com',
  //     phone: '222-222-2222'
  //   },
  //   {
  //     _id: 3,
  //     type: 'personal',
  //     name: 'Melissa Williams',
  //     email: 'missy@gmail.com',
  //     phone: '333-333-3334'
  //   }
  // ],
  users: null,
  user: null,
  filteredUsers: null,
  usersErrors: null,
  usersLoading: false
};

const UsersState = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Get Users
  const getUsers = useCallback(async _ => {
    dispatch({ type: SET_USERS_LOADING });
    try {
      const res = await axios.get('/api/backend/users/users');
      dispatch({ type: GET_USERS, payload: res.data });
    } catch (err) {
      handleServerError(err, USERS_ERRORS, dispatch);
    }
  }, []);

  // Clear Users
  const clearUsers = useCallback(_ => {
    dispatch({ type: CLEAR_USERS });
  }, []);

  // Get User
  const getUser = useCallback(async userId => {
    if (!userId) {
      dispatch({
        type: USERS_ERRORS,
        payload: [User.usersResponseTypes.USER_NOT_EXISTS.type]
      });
      return;
    }
    dispatch({ type: SET_USERS_LOADING });
    try {
      const res = await axios.get(`/api/backend/users/users/${userId}`);
      dispatch({ type: GET_USER, payload: res.data });
    } catch (err) {
      handleServerError(err, USERS_ERRORS, dispatch);
    }
  }, []);

  // Clear User
  const clearUser = useCallback(_ => {
    dispatch({ type: CLEAR_USER });
  }, []);

  // Add User
  const addUser = useCallback(async user => {
    let newUser = null;
    dispatch({ type: SET_USERS_LOADING });
    //user._id = guid();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/backend/users/users', user, config);
      dispatch({ type: ADD_USER, payload: res.data });
      newUser = res.data;
    } catch (err) {
      handleServerError(err, USERS_ERRORS, dispatch);
    }
    return newUser;
  }, []);

  // Update User
  const updateUser = useCallback(async user => {
    let newUser = null;
    dispatch({ type: SET_USERS_LOADING });
    //user._id = guid();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      //console.log(user);
      const res = await axios.put(
        `/api/backend/users/users/${user._id}`,
        user,
        config
      );
      dispatch({ type: UPDATE_USER, payload: res.data });
      newUser = res.data;
    } catch (err) {
      handleServerError(err, USERS_ERRORS, dispatch);
    }
    return newUser;
  }, []);

  // Edit Password
  const editPassword = useCallback(async user => {
    let newUser = null;
    dispatch({ type: SET_USER_PASSWORD_LOADING });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      //console.log(user);
      const res = await axios.put(
        `/api/backend/users/editPassword/${user._id}`,
        user,
        config
      );
      dispatch({ type: EDIT_USER_PASSWORD, payload: res.data });
      newUser = res.data;
    } catch (err) {
      handleServerError(err, USER_PASSWORD_ERRORS, dispatch);
    }
    return newUser;
  }, []);

  // Filter Users
  const filterUsers = useCallback(text => {
    dispatch({ type: FILTER_USERS, payload: text });
  }, []);

  // Clear Filter
  const clearFilterUsers = useCallback(text => {
    dispatch({ type: CLEAR_FILTER_USERS });
  }, []);

  // Clear Users Error
  const clearUsersErrors = useCallback(_ => {
    dispatch({ type: CLEAR_USERS_ERRORS });
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users: state.users,
        user: state.user,
        filteredUsers: state.filteredUsers,
        usersErrors: state.usersErrors,
        getUsers,
        clearUsers,
        getUser,
        clearUser,
        addUser,
        updateUser,
        editPassword,
        filterUsers,
        clearFilterUsers,
        clearUsersErrors
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersState;
