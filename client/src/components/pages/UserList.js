import React, { useContext, useEffect, useCallback, useState } from 'react';
import UserContext from 'contexts/users/usersContext';
import UsersPageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table';
import LinkButton from 'components/form/LinkButton';
import Form from 'components/form/Form';
import UserFilter from '../users/UserFilter';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import orderBy from 'utils/array/orderBy';
import { goToUrl } from 'utils/history';
import getUserForDisplay from 'utils/users/getUserForDisplay';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

const headers = [
  {
    name: uiWordings['User.NameLabel'],
    value: 'name',
    isSortEnabled: true
  },
  {
    name: uiWordings['User.EmailLabel'],
    value: 'email',
    isSortEnabled: true
  },
  {
    name: uiWordings['User.RoleLabel'],
    value: 'roleDisplay',
    isSortEnabled: true
  },
  // {
  //   name: uiWordings['User.CreateDTLabel'],
  //   value: 'createDT',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['User.LastModifyDTLabel'],
    value: 'lastModifyDT',
    isSortEnabled: true
  },
  {
    name: uiWordings['User.LastModifyUserLabel'],
    value: 'lastModifyUserDisplay',
    isSortEnabled: true
  },
  {
    name: uiWordings['User.IsEnabledLabel'],
    value: 'isEnabledDisplay',
    isSortEnabled: true
  }
];

const UserTable = ({ users, onEditClick }) => {
  const rows = users.map(getUserForDisplay);

  const [sortParams, setSortParams] = useState({
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* methods */

  const changeSort = useCallback(
    ({ newSortBy }) => {
      setSortParams(currSortParams => {
        if (currSortParams.sortBy === newSortBy) {
          if (currSortParams.sortOrder === 'asc') {
            return {
              ...currSortParams,
              sortOrder: 'desc'
            };
          } else {
            return {
              ...currSortParams,
              sortOrder: 'asc'
            };
          }
        } else {
          return {
            sortBy: newSortBy,
            sortOrder: 'asc'
          };
        }
      });
    },
    [setSortParams]
  );

  /* end of methods */

  /* event handlers */

  const onDetailClick = useCallback(
    data => {
      onEditClick(data);
    },
    [onEditClick]
  );

  const onChangeSort = useCallback(
    ({ sortBy, isSortEnabled }) => {
      if (isSortEnabled) {
        changeSort({
          newSortBy: sortBy
        });
      }
    },
    [changeSort]
  );

  /* end of event handler */

  const sortedRows = orderBy(rows, [sortParams.sortBy], [sortParams.sortOrder]);

  return (
    <Table
      headers={headers}
      rows={sortedRows}
      sortBy={sortParams.sortBy}
      sortOrder={sortParams.sortOrder}
      onDetailClick={onDetailClick}
      onChangeSort={onChangeSort}
    />
  );
};

const UserList = _ => {
  const { users, filteredUsers, usersLoading, getUsers } = useContext(
    UserContext
  );

  // componentDidMount
  useEffect(
    _ => {
      getUsers();
    },
    // eslint-disable-next-line
    []
  );

  /* event handlers */

  const onEditUser = useCallback(user => {
    goToUrl(routes.userEditByIdWithValue(true, user._id));
  }, []);

  /* end of event handlers */

  if (users === null || usersLoading) {
    return (
      <div className='loading-container'>
        <Loading />
      </div>
    );
  }

  const addUserButton = (
    <LinkButton to={routes.userAdd(true)}>
      {uiWordings['UserList.AddUser']}
    </LinkButton>
  );

  if (!isNonEmptyArray(users)) {
    return (
      <>
        <h4>{uiWordings['UserList.AddUserPrompt']}</h4>
        {addUserButton}
      </>
    );
  }

  const usersToFillTable = isNonEmptyArray(filteredUsers)
    ? filteredUsers
    : users;

  return (
    <>
      <Form className='w3-half w3-padding'>
        {addUserButton}
        <UserFilter />
      </Form>
      <UserTable users={usersToFillTable} onEditClick={onEditUser} />
    </>
  );
};

const UserListWithContainer = _ => (
  <UsersPageContainer>
    <UserList />
  </UsersPageContainer>
);

export default UserListWithContainer;
