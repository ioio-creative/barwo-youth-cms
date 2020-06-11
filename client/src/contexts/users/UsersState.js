import React, { useReducer, useCallback } from 'react';
//import { v4 as uuid } from 'uuid';
import axios from 'axios';
import UsersContext from './usersContext';
import usersReducer from './usersReducer';
import usersResponseTypes from 'types/responses/users';
import {
  GET_USERS,
  GET_USER,
  CLEAR_USER,
  ADD_USER,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_USERS,
  CLEAR_FILTER_USERS,
  USERS_ERROR,
  CLEAR_USERS_ERROR,
  SET_USERS_LOADING
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
  usersError: null,
  usersLoading: false
};

const UsersState = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Get Users
  const getUsers = useCallback(async _ => {
    dispatch({ type: SET_USERS_LOADING });
    try {
      const res = await axios.get('/api/users');
      dispatch({ type: GET_USERS, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.type });
    }
  }, []);

  // Get User
  const getUser = useCallback(async userId => {
    if (!userId) {
      dispatch({
        type: USERS_ERROR,
        payload: usersResponseTypes.USER_NOT_EXISTS.type
      });
      return;
    }
    dispatch({ type: SET_USERS_LOADING });
    try {
      const res = await axios.get(`/api/users/${userId}`);
      dispatch({ type: GET_USER, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.type });
    }
  }, []);

  // Clear User
  const clearUser = useCallback(_ => {
    dispatch({ type: CLEAR_USER });
  }, []);

  // Add User
  const addUser = useCallback(async user => {
    let isSuccess = false;
    dispatch({ type: SET_USERS_LOADING });
    //user._id = uuid();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/users', user, config);
      dispatch({ type: ADD_USER, payload: res.data });
      isSuccess = true;
    } catch (err) {
      dispatch({ type: USERS_ERROR, payload: err.response.data.type });
    }
    return isSuccess;
  }, []);

  // Update User
  const updateUser = useCallback(async user => {
    let isSuccess = false;
    dispatch({ type: SET_USERS_LOADING });
    //user._id = uuid();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      //console.log(user);
      const res = await axios.put(`/api/users/${user._id}`, user, config);
      dispatch({ type: UPDATE_USER, payload: res.data });
      isSuccess = true;
    } catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.type });
    }
    return isSuccess;
  }, []);

  // Clear Users
  const clearUsers = useCallback(_ => {
    dispatch({ type: CLEAR_USERS });
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
  const clearUsersError = useCallback(_ => {
    dispatch({ type: CLEAR_USERS_ERROR });
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users: state.users,
        user: state.user,
        filteredUsers: state.filteredUsers,
        usersError: state.usersError,
        getUsers,
        getUser,
        clearUser,
        addUser,
        updateUser,
        clearUsers,
        filterUsers,
        clearFilterUsers,
        clearUsersError
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersState;
