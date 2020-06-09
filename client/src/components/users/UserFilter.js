import React, { useContext, useState, useEffect, useCallback } from 'react';
import UsersContext from 'contexts/users/usersContext';
import uiWordings from 'globals/uiWordings';
import InputText from 'components/form/InputText';

const UserFilter = _ => {
  const { filterUsers, clearFilterUsers } = useContext(UsersContext);
  const [text, setText] = useState('');

  const onChange = useCallback(
    e => {
      console.log(text);
      if (text.current.value !== '') {
        filterUsers(e.target.value);
      } else {
        clearFilterUsers();
      }
    },
    [text, filterUsers, clearFilterUsers]
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
