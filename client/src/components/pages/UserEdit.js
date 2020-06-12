import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import UserContext from 'contexts/users/usersContext';
import UsersPageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import User from 'models/user';
import alertTypes from 'types/alertTypes';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';

const emptyUser = new User();
const defaultState = {
  ...emptyUser,
  password2: ''
};

const UserEdit = _ => {
  const match1 = useRouteMatch('/userEdit/:id');
  const match2 = useRouteMatch('/userAdd');
  console.log(match1, match2);

  const { userId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    user: fetchedUser,
    usersErrors,
    usersLoading,
    getUser,
    clearUser,
    addUser,
    updateUser,
    clearUsersErrors
  } = useContext(UserContext);

  const [user, setUser] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddUserMode, setIsAddUserMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (userId) {
        getUser(userId);
      }

      return _ => {
        clearUser();
      };
    },
    [userId, getUser, clearUser]
  );

  useEffect(
    _ => {
      if (!usersLoading) {
        setUser(
          fetchedUser ? User.getUserForDisplay(fetchedUser) : defaultState
        );
        setIsAddUserMode(!fetchedUser);
      }
    },
    [usersLoading, fetchedUser, setUser]
  );

  useEffect(
    _ => {
      if (isNonEmptyArray(usersErrors)) {
        setAlerts(
          usersErrors.map(usersError => {
            return {
              msg: User.usersResponseTypes[usersError].msg,
              type: alertTypes.WARNING
            };
          })
        );
        clearUsersErrors();

        if (
          usersErrors.includes(User.usersResponseTypes.USER_NOT_EXISTS.type)
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [usersErrors, setAlerts, clearUsersErrors]
  );

  /* methods */

  const validInput = useCallback(
    userInput => {
      if (isAddUserMode) {
        if (userInput.password !== userInput.password2) {
          setAlerts([
            {
              msg: uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
              type: alertTypes.WARNING
            }
          ]);
          return false;
        }
      }
      return true;
    },
    [isAddUserMode, setAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser, removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      let isSuccess = false;
      let returnedUser = null;
      isSuccess = validInput(user);
      const { password2, ...cleanedUser } = user;
      if (isSuccess) {
        const funcToCall = isAddUserMode ? addUser : updateUser;
        returnedUser = await funcToCall(cleanedUser);
        isSuccess = Boolean(returnedUser);
      }
      if (isSuccess) {
        setAlerts([
          {
            msg: isAddUserMode
              ? uiWordings['UserEdit.AddUserSuccessMessage']
              : uiWordings['UserEdit.UpdateUserSuccessMessage'],
            type: alertTypes.INFO
          }
        ]);
        goToUrl(routes.userEditByIdWithValue(true, returnedUser._id));
      }
      setIsSubmitEnabled(false);
    },
    [isAddUserMode, updateUser, addUser, user, setAlerts, validInput]
  );

  /* end of event handlers */

  if (usersLoading) {
    return <Loading />;
  }

  const backToUserListButton = (
    <Form>
      <LinkButton to={routes.userList(true)}>
        {uiWordings['UserEdit.BackToUserList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToUserListButton}</>;
  }

  return (
    <>
      {backToUserListButton}

      <Form onSubmit={onSubmit}>
        <h3>
          {isAddUserMode
            ? uiWordings['UserEdit.AddUserTitle']
            : uiWordings['UserEdit.EditUserTitle']}
        </h3>
        <LabelInputTextPair
          name='email'
          value={user.email}
          inputType='email'
          labelMessage={uiWordings['User.EmailLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        {isAddUserMode && (
          <>
            <LabelInputTextPair
              name='password'
              value={user.password}
              inputType='password'
              labelMessage={uiWordings['User.PasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              minLength='6'
            />
            <LabelInputTextPair
              name='password2'
              value={user.password2}
              inputType='password'
              labelMessage={uiWordings['UserEdit.ConfirmPasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              minLength='6'
            />
          </>
        )}
        <LabelInputTextPair
          name='name'
          value={user.name}
          labelMessage={uiWordings['User.NameLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelSelectPair
          name='role'
          value={user.role}
          options={User.userRoleOptions}
          labelMessage={uiWordings['User.RoleLabel']}
          onChange={onChange}
        />
        <LabelTogglePair
          name='isEnabled'
          value={user.isEnabled}
          labelMessage={uiWordings['User.IsEnabledLabel']}
          onChange={onChange}
        />
        {!isAddUserMode && (
          <>
            <LabelLabelPair
              value={user.createDTDisplay}
              labelMessage={uiWordings['User.CreateDTLabel']}
            />
            <LabelLabelPair
              value={user.lastModifyDTDisplay}
              labelMessage={uiWordings['User.LastModifyDTLabel']}
            />
            <LabelLabelPair
              value={user.lastModifyUserDisplay}
              labelMessage={uiWordings['User.LastModifyUserLabel']}
            />
          </>
        )}
        <SubmitButton
          disabled={!isSubmitEnabled}
          label={
            isAddUserMode
              ? uiWordings['UserEdit.AddUserSubmit']
              : uiWordings['UserEdit.UpdateUserSubmit']
          }
        />
      </Form>
    </>
  );
};

const UserEditWithContainer = _ => (
  <UsersPageContainer>
    <UserEdit />
  </UsersPageContainer>
);

export default UserEditWithContainer;
