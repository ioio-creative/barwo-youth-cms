import React, { useContext, useState, useCallback } from 'react';
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

const passwordMinLength = config.User.password.minLength;

const PasswordEdit = () => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const { updateUser } = useContext(UsersContext);

  const [user, setUser] = useState({
    password: '',
    password1: '',
    password2: ''
  });

  const [isChangePassword, setIsChangePassword] = useState(false);

  const onChange = useCallback(
    e => {
      removeAlerts();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser, removeAlerts]
  );

  // const validInput = useCallback(
  //   userInput => {
  //     if (
  //       // userInput.password !== user.password ||
  //       userInput.password1 !== userInput.password2
  //     ) {
  //       setAlerts(
  //         new Alert(
  //           uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
  //           Alert.alertTypes.WARNING
  //         )
  //       );
  //       return false;
  //     }
  //     return true;
  //   },
  //   [setIsChangePassword, isChangePassword]
  // );

  const onSubmit = () => {};

  // const onSubmit = useCallback(
  //   async e => {
  //     removeAlerts();
  //     e.preventDefault();
  //     if (password === '') {
  //       setAlerts(
  //         new Alert(
  //           uiWordings['Login.FillInAllFieldsMessage'],
  //           Alert.alertTypes.WARNING
  //         )
  //       );
  //     } else {
  //     setIsChangePassword(true);
  //     let isSuccess = false;
  //     let returnedUser = null;
  //     isSuccess = validInput(user);
  //     const { password2, ...cleanedUser } = user;
  //     if (isSuccess) {
  //       const funcToCall = updateUser;
  //       returnedUser = await funcToCall(cleanedUser);
  //       isSuccess = Boolean(returnedUser);
  //     }
  //     if (isSuccess) {
  //       setAlerts(
  //         new Alert(
  //           uiWordings['UserEdit.UpdateUserSuccessMessage'],
  //           Alert.alertTypes.INFO
  //         )
  //       );
  //       goToUrl(routes.passwordChange()));
  //       setUser(returnedUser);
  //     }
  //   },
  //   [email, password, setAlerts, login, removeAlerts, setIsChangePassword, isChangePassword]
  // );
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
