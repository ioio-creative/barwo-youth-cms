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
import alertTypes from 'types/alertTypes';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import { goToUrl } from 'utils/history';

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
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  const alertId = useRef(null);

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
    [userId]
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
      if (usersError) {
        alertId.current = setAlert(
          User.usersResponseTypes[usersError].msg,
          alertTypes.WARNING
        );
        clearUsersError();

        if (usersError === User.usersResponseTypes.USER_NOT_EXISTS.type) {
          setIsAbandonEdit(true);
        }
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

  const validInput = useCallback(userInput => {
    if (isAddUserMode) {
      if (user.password !== user.password2) {
        alertId.current = setAlert(
          uiWordings['UserEdit.ConfirmPasswordDoesNotMatchMessage'],
          alertTypes.WARNING
        );
        return false;
      }
    }
    return true;
  });

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
      let returnedUser = null;
      isSuccess = validInput();
      if (isSuccess) {
        const funcToCall = isAddUserMode ? addUser : updateUser;
        returnedUser = await funcToCall(cleanedUser);
        isSuccess = Boolean(returnedUser);
      }
      if (isSuccess) {
        alertId.current = setAlert(
          isAddUserMode
            ? uiWordings['UserEdit.AddUserSuccessMessage']
            : uiWordings['UserEdit.UpdateUserSuccessMessage'],
          alertTypes.INFO
        );
        goToUrl(routes.userEditByIdWithValue(true, returnedUser._id));
      }
      setIsSubmitEnabled(false);
    },
    [isAddUserMode, updateUser, addUser, user, setAlert]
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
          options={User.userRoleOptionsuserRoleOptions}
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
