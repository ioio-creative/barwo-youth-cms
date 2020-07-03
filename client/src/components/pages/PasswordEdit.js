import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import UsersContext from 'contexts/users/usersContext';
import PasswordChangePageContainer from 'components/users/UsersPageContainer';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import Alert from 'models/alert';
import User from 'models/user';
import uiWordings from 'globals/uiWordings';
import config from 'config/default.json';
import { goToUrl } from 'utils/history';
import routes from 'globals/routes';
import AuthContext from 'contexts/auth/authContext';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import Loading from 'components/layout/loading/DefaultLoading';

const passwordMinLength = config.User.password.minLength;

const emptyUser = new User();
const defaultState = {
  ...emptyUser,
  password1: '',
  password2: ''
};

const PasswordEdit = () => {
  const { userId } = useParams();
  const { authUser } = useContext(AuthContext);
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    clearUsersErrors,
    usersErrors,
    getUser,
    clearUser,
    editPassword,
    usersLoading
  } = useContext(UsersContext);

  const [user, setUser] = useState(defaultState);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

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
      if (authUser) {
        setUser(authUser);
        goToUrl(routes.editPasswordWithId(true, authUser._id));
      }
      return _ => {
        clearUser();
      };
    },
    [userId, getUser, clearUser, authUser]
  );

  // usersErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(usersErrors)) {
        console.log(usersErrors);
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
    // [usersErrors, setAlerts, clearUsersErrors]
    [usersErrors, setAlerts, clearUsersErrors, setIsAbandonEdit]
  );

  const onChange = useCallback(
    e => {
      removeAlerts();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser, removeAlerts]
  );

  const validInput = useCallback(
    userInput => {
      if (userInput.password1 !== userInput.password2) {
        setAlerts(
          new Alert(
            uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
            Alert.alertTypes.WARNING
          )
        );
        console.log(userInput.password, authUser);
        console.log(userInput.password1, userInput.password2);
        return false;
      }
      console.log(userInput.password, user.password);
      console.log(userInput.password1, userInput.password2);
      return true;
    },
    [setAlerts, authUser, user]
  );

  const onSubmit = useCallback(
    async e => {
      removeAlerts();
      e.preventDefault();
      let isSuccess = false;
      let returnedUser = null;
      isSuccess = validInput(user);
      console.log(isSuccess);
      const { password2, ...cleanedUser } = user;
      if (isSuccess) {
        console.log(user.password1);
        console.log(cleanedUser);
        const funcToCall = editPassword;
        returnedUser = await funcToCall(cleanedUser);
        isSuccess = Boolean(returnedUser);
      }
      console.log(returnedUser);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['UserEdit.ChangePasswordSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );
        goToUrl(routes.editPasswordWithId(true, returnedUser._id));
        setUser({
          ...user,
          password: '',
          password1: '',
          password2: ''
        });
      }
    },
    [user, removeAlerts, setAlerts, editPassword, validInput]
  );

  if (usersLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h4>{uiWordings['UserEdit.ChangePasswordLabel']}</h4>
        <LabelInputTextPair
          name='password'
          value={user.password}
          inputType='password'
          labelMessage={uiWordings['UserEdit.OldPasswordLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          minLength={passwordMinLength}
        />
        <LabelInputTextPair
          name='password1'
          value={user.password1}
          inputType='password'
          labelMessage={uiWordings['UserEdit.NewPasswordLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
          minLength={passwordMinLength}
        />
        <LabelInputTextPair
          name='password2'
          value={user.password2}
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
  <PasswordChangePageContainer>
    <PasswordEdit />
  </PasswordChangePageContainer>
);

export default PasswordEditWithContainer;
