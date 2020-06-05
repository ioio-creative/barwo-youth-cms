import React, { useContext, useEffect, useCallback } from 'react';
import UserContext from 'contexts/users/usersContext';
import Loading from 'components/layout/loading/DefaultLoading';
import UserFilter from './UserFilter';
import UserItem from './UserItem';
import { defaultState as defaultUser } from './UserForm';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import uiWordings from 'globals/uiWordings';

const UserList = _ => {
  const {
    users,
    filteredUsers,
    usersLoading,
    getUsers,
    setCurrentUserToEdit
  } = useContext(UserContext);

  // componentDidMount
  useEffect(
    _ => {
      getUsers();
    },
    // eslint-disable-next-line
    []
  );

  const onAddUser = useCallback(
    _ => {
      setCurrentUserToEdit(defaultUser);
    },
    [defaultUser]
  );

  if (users === null || usersLoading) {
    return <Loading />;
  }

  const addUserButton = (
    <button onClick={onAddUser}>{uiWordings['UserList.AddUser']}</button>
  );

  if (!isNonEmptyArray(users)) {
    return (
      <>
        <h4>{uiWordings['UserList.AddUserPrompt']}</h4>
        {addUserButton}
      </>
    );
  }

  return (
    <>
      {addUserButton}
      <UserFilter />
      {(isNonEmptyArray(filteredUsers) ? filteredUsers : users).map(user => {
        return <UserItem key={user._id} user={user} />;
      })}
    </>
  );
};

export default UserList;
