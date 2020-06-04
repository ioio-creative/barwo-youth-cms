import React, { useReducer, useCallback } from 'react';
//import { v4 as uuid } from 'uuid';
import axios from 'axios';
import UsersContext from './usersContext';
import usersReducer from './usersReducer';
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
  currentUserToEdit: null,
  filteredUsers: null,
  usersError: null,
  usersLoading: false
};

const UsersState = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Get Users
  const getUsers = useCallback(async _ => {
    try {
      const res = await axios.get('/api/users');
      dispatch({ type: GET_USERS, payload: res.data });
    } catch (err) {
      dispatch({ type: USERS_ERROR, payload: err.response.msg });
    }
  }, []);

  // Add User
  const addUser = useCallback(async user => {
    //user._id = uuid();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/users', user, config);
      dispatch({ type: ADD_USER, payload: res.data });
    } catch (err) {
      dispatch({ type: USERS_ERROR, payload: err.response.msg });
    }
  }, []);

  // Update User
  const updateUser = useCallback(async user => {
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
    } catch (err) {
      dispatch({ type: USERS_ERROR, payload: err.response.msg });
    }
  }, []);

  // Delete User
  const deleteUser = useCallback(async id => {
    try {
      await axios.delete(`/api/users/${id}`);
      dispatch({ type: DELETE_USER, payload: id });
    } catch (err) {
      dispatch({ type: USERS_ERROR, payload: err.response.msg });
    }
  }, []);

  // Clear Users
  const clearUsers = useCallback(_ => {
    dispatch({ type: CLEAR_USERS });
  }, []);

  // Set Current User to Edit
  const setCurrentUserToEdit = useCallback(user => {
    dispatch({ type: SET_CURRENT_USER_TO_EDIT, payload: user });
  }, []);

  // Clear Current User to Edit
  const clearCurrentUserToEdit = useCallback(_ => {
    dispatch({ type: CLEAR_CURRENT_USER_TO_EDIT });
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
        currentUserToEdit: state.currentUserToEdit,
        filteredUsers: state.filteredUsers,
        usersError: state.error,
        getUsers,
        addUser,
        updateUser,
        deleteUser,
        clearUsers,
        setCurrentUserToEdit,
        clearCurrentUserToEdit,
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
