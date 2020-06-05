import React, { useContext, useRef, useEffect, useCallback } from 'react';
import UsersContext from 'contexts/users/usersContext';
import uiWordings from 'globals/uiWordings';

const UserFilter = _ => {
  const { filteredUsers, filterUsers, clearFilterUsers } = useContext(
    UsersContext
  );
  const text = useRef('');

  useEffect(
    _ => {
      if (filteredUsers === null) {
        text.current.value = '';
      }
    },
    [filteredUsers]
  );

  const onChange = useCallback(
    e => {
      if (text.current.value !== '') {
        filterUsers(e.target.value);
      } else {
        clearFilterUsers();
      }
    },
    [text.current.value, filterUsers, clearFilterUsers]
  );

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder={uiWordings['UserFilter.FilterTextPlaceHolder']}
        onChange={onChange}
      />
    </form>
  );
};

export default UserFilter;
