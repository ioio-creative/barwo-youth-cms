import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { useParams } from 'react-router-dom';
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
import { userRoleOptions } from 'types/userRoles';
import usersResponseTypes from 'types/responses/users';
import alertTypes from 'types/alertTypes';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import getUserForDisplay from 'utils/users/getUserForDisplay';

const emptyUser = new User();
const defaultState = {
  ...emptyUser,
  password2: ''
};

const UserEdit = _ => {
  const { userId } = useParams();
  const { setAlert, removeAlert, removeAlerts } = useContext(AlertContext);
  const {
    user: fetchedUser,
    usersError,
    usersLoading,
    getUser,
    clearUser,
    addUser,
    updateUser,
    clearUsersError
  } = useContext(UserContext);

  const [user, setUser] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddUserMode, setIsAddUserMode] = useState(false);

  const alertId = useRef(null);

  // componentDidMount
  useEffect(_ => {
    getUser(userId);

    return _ => {
      removeAlerts();
      clearUser();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (!usersLoading) {
        setUser(fetchedUser ? getUserForDisplay(fetchedUser) : defaultState);
        setIsAddUserMode(!fetchedUser);
      }
    },
    [usersLoading, fetchedUser, setUser]
  );

  useEffect(
    _ => {
      if (usersError) {
        alertId.current = setAlert(
          usersResponseTypes[usersError].msg,
          alertTypes.WARNING
        );
        clearUsersError();
      }
    },
    [usersError, setAlert, clearUsersError]
  );

  /* methods */

  const clearAlert = useCallback(
    _ => {
      if (alertId.current) {
        removeAlert(alertId.current);
        alertId.current = null;
      }
    },
    [alertId, removeAlert]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      clearAlert();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser, clearAlert]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const { password2, ...cleanedUser } = user;
      let isSuccess = false;
      if (isAddUserMode) {
        isSuccess = await addUser(cleanedUser);
      } else {
        isSuccess = await updateUser(cleanedUser);
      }
      if (isSuccess) {
        alertId.current = setAlert(
          isAddUserMode
            ? uiWordings['UserEdit.AddUserSuccessMessage']
            : uiWordings['UserEdit.UpdateUserSuccessMessage'],
          alertTypes.INFO,
          -1
        );
        setUser(
          getUserForDisplay({
            ...cleanedUser,
            lastModifyDT: new Date()
          })
        );
      }
      setIsSubmitEnabled(false);
    },
    [isAddUserMode, updateUser, addUser, user, setAlert]
  );

  /* end of event handlers */

  if (usersLoading) {
    return <Loading />;
  }

  return (
    <>
      <Form>
        <LinkButton to={routes.userList(true)}>
          {uiWordings['UserEdit.BackToUserList']}
        </LinkButton>
      </Form>

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
          options={userRoleOptions}
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
