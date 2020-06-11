import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import UserContext from 'contexts/users/usersContext';
import UsersPageContainer from 'components/users/UsersPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import LabelSelectPair from 'components/form/LabelSelectPair';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import SubmitButton from 'components/form/SubmitButton';
import LinkButton from 'components/form/LinkButton';
import userRoles, { userRoleOptions } from 'types/userRoles';
import usersResponseTypes from 'types/responses/users';
import alertTypes from 'types/alertTypes';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray from 'utils/array/isNonEmptyArray';
import getUserForDisplay from 'utils/users/getUserForDisplay';

export const defaultState = {
  email: '',
  password: '',
  name: '',
  role: userRoles.EDITOR.value,

  password2: ''
};

const UserEdit = _ => {
  const { userId } = useParams();
  const { setAlert, removeAlert } = useContext(AlertContext);
  const {
    users,
    usersError,
    addUser,
    updateUser,
    clearUsersError
  } = useContext(UserContext);

  const [user, setUser] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddUserMode, setIsAddUserMode] = useState(false);

  const alertId = useRef(null);

  const currentUserToEdit = useMemo(
    _ => {
      if (!isNonEmptyArray(users) || !userId) {
        return null;
      }

      return users.filter(user => userId === user._id);
    },
    [users, userId]
  );

  // componentDidMount
  useEffect(_ => {
    if (currentUserToEdit) {
      setUser(getUserForDisplay(currentUserToEdit));
    } else {
      setUser(defaultState);
    }
    return _ => {
      clearAlert();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (usersError) {
        setAlert(usersResponseTypes[usersError].msg, alertTypes.WARNING);
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
      }
      setIsSubmitEnabled(false);
    },
    [isAddUserMode, updateUser, addUser, user, setAlert]
  );

  /* end of event handlers */

  const { email, name, password, password2, role } = user;

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
          value={email}
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
              value={password}
              inputType='password'
              labelMessage={uiWordings['User.PasswordLabel']}
              placeholder=''
              onChange={onChange}
              required={true}
              minLength='6'
            />
            <LabelInputTextPair
              name='password2'
              value={password2}
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
          value={name}
          labelMessage={uiWordings['User.NameLabel']}
          placeholder=''
          onChange={onChange}
          required={true}
        />
        <LabelSelectPair
          name='role'
          value={role}
          options={userRoleOptions}
          labelMessage={uiWordings['User.RoleLabel']}
          onChange={onChange}
        />
        <div className='w3-center'>
          <SubmitButton
            disabled={!isSubmitEnabled}
            label={
              isAddUserMode
                ? uiWordings['UserEdit.AddUserSubmit']
                : uiWordings['UserEdit.UpdateUserSubmit']
            }
          />
        </div>
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
