import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import UsersContext from 'contexts/users/usersContext';
import PasswordEditPageContainer from 'components/users/PasswordEditPageContainer';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import Alert from 'models/alert';
import User from 'models/user';
import uiWordings from 'globals/uiWordings';
import config from 'config/default.json';
import AuthContext from 'contexts/auth/authContext';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import Loading from 'components/layout/loading/DefaultLoading';

const passwordMinLength = config.User.password.minLength;

const defaultState = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
};

const PasswordEdit = _ => {
  const { authUser } = useContext(AuthContext);
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    clearUsersErrors,
    usersErrors,
    editPassword,
    usersLoading
  } = useContext(UsersContext);

  const [user, setUser] = useState(defaultState);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // authUser
  useEffect(
    _ => {
      if (authUser) {
        setUser(authUser);
      }
    },
    [authUser]
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

  /* methods */

  const validInput = useCallback(
    userInput => {
      if (userInput.newPassword !== userInput.newPasswordConfirm) {
        setAlerts(
          new Alert(
            uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
            Alert.alertTypes.WARNING
          )
        );
        return false;
      }
      return true;
    },
    [setAlerts]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    },
    [removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      removeAlerts();
      e.preventDefault();
      let isSuccess = false;
      let returnedUser = null;
      isSuccess = validInput(user);
      if (isSuccess) {
        returnedUser = await editPassword({
          ...user,
          oldPassword: user.oldPassword,
          newPassword: user.newPassword
        });
        isSuccess = Boolean(returnedUser);
      }
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['UserEdit.ChangePasswordSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        setUser(prevUser => ({
          ...prevUser, // prevUser contains _id
          ...defaultState
        }));
      }
    },
    [user, removeAlerts, setAlerts, editPassword, validInput]
  );

  /* end of event handlers */

  if (usersLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h4>{uiWordings['UserEdit.PasswordEdit']}</h4>
        <LabelInputTextPair
          name='oldPassword'
          value={user.oldPassword}
          inputType='password'
          labelMessage={uiWordings['UserEdit.OldPasswordLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          minLength={passwordMinLength}
        />
        <LabelInputTextPair
          name='newPassword'
          value={user.newPassword}
          inputType='password'
          labelMessage={uiWordings['UserEdit.NewPasswordLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          minLength={passwordMinLength}
        />
        <LabelInputTextPair
          name='newPasswordConfirm'
          value={user.newPasswordConfirm}
          inputType='password'
          labelMessage={uiWordings['UserEdit.ConfirmPasswordLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          minLength={passwordMinLength}
        />
        <SubmitButton label={uiWordings['UserEdit.ChangePasswordLabel']} />
      </Form>
    </>
  );
};

const PasswordEditWithContainer = _ => (
  <PasswordEditPageContainer>
    <PasswordEdit />
  </PasswordEditPageContainer>
);

export default PasswordEditWithContainer;
