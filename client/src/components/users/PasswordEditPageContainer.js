import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import UsersState from 'contexts/users/UsersState';
import uiWordings from 'globals/uiWordings';

const PasswordEditPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['UserEdit.PasswordEdit']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <UsersState>
      <div className='password-edit-page-container'>{children}</div>
    </UsersState>
  );
};

export default PasswordEditPageContainer;
