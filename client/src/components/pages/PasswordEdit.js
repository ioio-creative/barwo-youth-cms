import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import UsersContext from 'contexts/users/usersContext';
import PasswordChangePageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
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
import { goToUrl } from 'utils/history';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';
import config from 'config/default.json';
import Button from 'components/form/Button';

const passwordMinLength = config.User.password.minLength;

const emptyUser = new User();
const defaultState = {
  ...emptyUser,
  password2: ''
};

const PasswordEdit = () => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const { updateUser } = useContext(UsersContext);
  // const updateUser = () => {};

  const [user, setUser] = useState(defaultState);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const onChange = useCallback(
    e => {
      removeAlerts();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser, removeAlerts]
  );

  const validInput = useCallback(
    userInput => {
      if (userInput.password !== userInput.password2) {
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
    [setIsChangePassword, isChangePassword]
  );
  const onSubmit = () => {};

  // const onSubmit = useCallback(
  //   async e => {
  //     e.preventDefault();
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
  //       goToUrl(routes.userEditByIdWithValue(true, returnedUser._id));
  //       setUser(returnedUser);
  //     }

  //     scrollToTop();
  //   },
  //   [setIsChangePassword, isChangePassword]
  // );
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h4>{uiWordings['UserEdit.ChangePasswordLabel']}</h4>
        <LabelInputTextPair
          name='password0'
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
          value={user.password2}
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
