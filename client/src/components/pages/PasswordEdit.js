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
  const { getUser, clearUser, updateUser } = useContext(UsersContext);

  const [user, setUser] = useState(defaultState);

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
      }
      return _ => {
        clearUser();
      };
    },
    [userId, getUser, clearUser, authUser]
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
      if (
        // userInput.password !== user.password ||
        userInput.password1 !== userInput.password2
      ) {
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

  // const onSubmit = () => {};

  const onSubmit = useCallback(
    async e => {
      removeAlerts();
      e.preventDefault();
      let isSuccess = false;
      let returnedUser = null;
      isSuccess = validInput(user);
      console.log(isSuccess);
      const { password2, password1, ...cleanedUser } = user;
      if (isSuccess) {
        console.log(user.password1);
        cleanedUser.password = user.password1;
        console.log(cleanedUser);
        // const funcToCall = editPassword;
        const funcToCall = updateUser;
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
        goToUrl(routes.editPasswordWithValue(true, returnedUser._id));
        setUser(returnedUser);
      }
    },
    [user, removeAlerts, setAlerts, updateUser, validInput]
  );

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
