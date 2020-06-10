import React from 'react';
import Titlebar from 'components/layout/Titlebar';
import UsersState from 'contexts/users/UsersState';
import uiWordings from 'globals/uiWordings';

const UsersPageContainer = ({ children }) => {
  return (
    <UsersState>
      <div className='users-page-container'>
        <Titlebar title={uiWordings['Users.Title']} />
        <div className='w3-container'>{children}</div>
      </div>
    </UsersState>
  );
};

export default UsersPageContainer;
