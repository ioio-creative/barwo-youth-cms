import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import UsersContext from 'contexts/users/usersContext';
import UsersPageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
import GroupContainer from 'components/layout/GroupContainer';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelTogglePair from 'components/form/LabelTogglePair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import Alert from 'models/alert';
import User from 'models/user';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';
import config from 'config/default.json';
import Button from 'components/form/Button';

const passwordMinLength = config.User.password.minLength;

const emptyUser = new User();
const defaultState = {
  ...emptyUser,
  passwordConfirm: ''
};

const UserEdit = _ => {
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
  } = useContext(UsersContext);

  const [user, setUser] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // userId
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

  // fetchedUser
  useEffect(
    _ => {
      setUser(fetchedUser ? User.getUserForDisplay(fetchedUser) : defaultState);
      setIsAddMode(!fetchedUser);
    },
    [fetchedUser]
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
      if (isAddMode || isChangePassword) {
        if (userInput.password !== userInput.passwordConfirm) {
          setAlerts(
            new Alert(
              uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
              Alert.alertTypes.WARNING
            )
          );
          return false;
        }
      }
      return true;
    },
    [isAddMode, isChangePassword, setAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onChangePasswordButtonClick = useCallback(_ => {
    setUser(prevUser => ({
      ...prevUser,
      password: '',
      passwordConfirm: ''
    }));
    setIsChangePassword(prevIsChangePassword => !prevIsChangePassword);
  }, []);

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    },
    [removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = false;
      let returnedUser = null;
      isSuccess = validInput(user);
      const { passwordConfirm, ...cleanedUser } = user;
      if (!isAddMode && !isChangePassword) {
        cleanedUser.password = null;
      }
      if (isSuccess) {
        const funcToCall = isAddMode ? addUser : updateUser;
        returnedUser = await funcToCall(cleanedUser);
        isSuccess = Boolean(returnedUser);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            isAddMode
              ? uiWordings['UserEdit.AddUserSuccessMessage']
              : uiWordings['UserEdit.UpdateUserSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getUser(returnedUser._id);
        setIsChangePassword(false);
      }

      scrollToTop();
    },
    [
      isAddMode,
      updateUser,
      addUser,
      getUser,
      user,
      setAlerts,
      validInput,
      isChangePassword,
      removeAlerts
    ]
  );

  /* end of event handlers */

  if (usersLoading) {
    return <Loading />;
  }

  const backToUserListButton = (
    <GroupContainer>
      <LinkButton to={routes.userList(true)}>
        {uiWordings['UserEdit.BackToUserList']}
      </LinkButton>
    </GroupContainer>
  );

  if (isAbandonEdit) {
    return <>{backToUserListButton}</>;
  }

  return (
    <>
      {backToUserListButton}

      <Form onSubmit={onSubmit}>
        <h4>
          {isAddMode
            ? uiWordings['UserEdit.AddUserTitle']
            : uiWordings['UserEdit.EditUserTitle']}
        </h4>
        <LabelInputTextPair
          name='email'
          value={user.email}
          inputType='email'
          labelMessage={uiWordings['User.EmailLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelInputTextPair
          name='name'
          value={user.name}
          labelMessage={uiWordings['User.NameLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        {(isAddMode || isChangePassword) && (
          <>
            <LabelInputTextPair
              name='password'
              value={user.password}
              inputType='password'
              labelMessage={uiWordings['User.PasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              minLength={passwordMinLength}
            />
            <LabelInputTextPair
              name='passwordConfirm'
              value={user.passwordConfirm}
              inputType='password'
              labelMessage={uiWordings['UserEdit.ConfirmPasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              minLength={passwordMinLength}
            />
            {!isAddMode && (
              <Button onClick={onChangePasswordButtonClick}>
                {uiWordings['UserEdit.CancelChangePasswordLabel']}
              </Button>
            )}
          </>
        )}
        {!isChangePassword && !isAddMode && (
          <Button onClick={onChangePasswordButtonClick}>
            {uiWordings['UserEdit.ChangePasswordLabel']}
          </Button>
        )}
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
        {!isAddMode && (
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
            isAddMode
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
