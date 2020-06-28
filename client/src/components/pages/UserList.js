import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo
} from 'react';
import AlertContext from 'contexts/alert/alertContext';
import UsersContext from 'contexts/users/usersContext';
import UsersPageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Table from 'components/layout/Table/Table';
import LinkButton from 'components/form/LinkButton';
import Form from 'components/form/Form';
import UserFilter from '../users/UserFilter';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import orderBy from 'utils/js/array/orderBy';
import { goToUrl } from 'utils/history';
import addIdx from 'utils/js/array/addIdx';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';
import User from 'models/user';
import Alert from 'models/alert';
import { generatePath } from 'react-router-dom';

const initialSortBy = 'name';
const initialSortOrder = 1;

const headers = [
  {
    name: uiWordings['Table.IndexColumnTitle'],
    value: 'idx',
    isSortEnabled: true
  },
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
  //   value: 'createDTDisplay',
  //   isSortEnabled: true
  // },
  {
    name: uiWordings['User.LastModifyDTLabel'],
    value: 'lastModifyDTDisplay',
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
  const [sortParams, setSortParams] = useState({
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });

  const sortedRowsWithIndices = useMemo(
    _ => {
      const rows = users.map(User.getUserForDisplay);
      const sortedRows = orderBy(
        rows,
        [sortParams.sortBy],
        [sortParams.sortOrder]
      );
      return addIdx(sortedRows);
    },
    [users, sortParams]
  );

  return (
    <Table
      headers={headers}
      rows={sortedRowsWithIndices}
      sortBy={sortParams.sortBy}
      sortOrder={sortParams.sortOrder}
      onDetailClick={onEditClick}
      setSortParamsFunc={setSortParams}
    />
  );
};

const UserList = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    users,
    filteredUsers,
    usersLoading,
    usersErrors,
    clearUsersErrors,
    getUsers
  } = useContext(UsersContext);

  // componentDidMount
  useEffect(
    _ => {
      getUsers();
      return _ => {
        removeAlerts();
      };
    },
    // eslint-disable-next-line
    []
  );

  // usersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(usersErrors)) {
        setAlerts(
          usersErrors.map(usersError => {
            return new Alert(
              User.usersResponseTypes[usersError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearUsersErrors();
      }
    },
    [usersErrors, setAlerts, clearUsersErrors]
  );

  /* event handlers */

  const onEdit = useCallback(user => {
    goToUrl(generatePath(routes.userEditById, { userId: user._id }));
    // goToUrl(routes.userEditByIdWithValue(true, user._id));
  }, []);

  /* end of event handlers */

  if (users === null || usersLoading) {
    return <Loading />;
  }

  const addButton = (
    <LinkButton to={routes.userAdd(true)}>
      {uiWordings['UserList.AddUser']}
    </LinkButton>
  );

  if (!isNonEmptyArray(users)) {
    return (
      <>
        <h4>{uiWordings['UserList.AddUserPrompt']}</h4>
        {addButton}
      </>
    );
  }

  const usersToFillTable = isNonEmptyArray(filteredUsers)
    ? filteredUsers
    : users;

  return (
    <>
      <Form>
        <div className='w3-half'>
          <UserFilter />
        </div>
        <div className='w3-right'>{addButton}</div>
      </Form>
      <UserTable users={usersToFillTable} onEditClick={onEdit} />
    </>
  );
};

const UserListWithContainer = _ => (
  <UsersPageContainer>
    <UserList />
  </UsersPageContainer>
);

export default UserListWithContainer;
