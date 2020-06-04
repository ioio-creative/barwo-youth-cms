import React, { useContext, useEffect } from 'react';
import Loading from 'components/asyncLoading/AsyncLoading';
import UserContext from 'contexts/users/usersContext';
import UserItem from './UserItem';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import uiWordings from 'globals/uiWordings';

const UserList = _ => {
  const { users, filteredUsers, usersLoading, getUsers } = useContext(
    UserContext
  );

  useEffect(_ => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  if (users === null || usersLoading) {
    return <Loading />;
  }

  if (!isNonEmptyArray(users)) {
    return <h4>{uiWordings['UserList.AddUserPrompt']}</h4>;
  }

  return (
    <>
      {(isNonEmptyArray(filteredUsers) ? filteredUsers : users).map(user => (
        <UserItem key={user._id} user={user} />
      ))}
    </>
  );
};

export default UserList;
