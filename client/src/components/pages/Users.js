import React, { useContext } from 'react';
import UserList from 'components/users/UserList';
import UserForm from 'components/users/UserForm';
import UsersState from 'contexts/users/UsersState';
import UsersContext from 'contexts/users/usersContext';
import uiWordings from 'globals/uiWordings';

const Users = _ => {
  const { currentUserToEdit } = useContext(UsersContext);

  return (
    <div className='grid-2'>
      <div>{uiWordings['Users.Title']}</div>
      <div>
        {currentUserToEdit ? (
          <UserForm user={currentUserToEdit} />
        ) : (
          <UserList />
        )}
      </div>
    </div>
  );
};

const UsersWithContext = _ => (
  <UsersState>
    <Users />
  </UsersState>
);

export default UsersWithContext;
