import React, { useContext, useState, useCallback } from 'react';
import UsersContext from 'contexts/users/usersContext';
import uiWordings from 'globals/uiWordings';
import InputText from 'components/form/InputText';

const UserFilter = _ => {
  const { filterUsers, clearFilterUsers } = useContext(UsersContext);
  const [text, setText] = useState('');

  const onChange = useCallback(
    e => {
      const value = e.target.value;
      setText(value);
      if (value !== '') {
        filterUsers(value);
      } else {
        clearFilterUsers();
      }
    },
    [setText, filterUsers, clearFilterUsers]
  );

  return (
    <InputText
      name='userFilter'
      placeholder={uiWordings['UserFilter.FilterTextPlaceHolder']}
      onChange={onChange}
      value={text}
    />
  );
};

export default UserFilter;
