import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import AlertContext from 'contexts/alert/alertContext';
import UserContext from 'contexts/users/usersContext';
import Select from 'components/form/Select';
import userRoles, { userRoleOptions } from 'types/userRoles';
import usersResponseTypes from 'types/responses/users';
import uiWordings from 'globals/uiWordings';

export const defaultState = {
  email: '',
  password: '',
  name: '',
  role: userRoles.NORMAL_USER.value,

  password2: ''
};

const UserForm = _ => {
  const { setAlert, removeAlert } = useContext(AlertContext);
  const {
    currentUserToEdit,
    usersError,
    addUser,
    updateUser,
    clearCurrentUserToEdit,
    clearUsersError
  } = useContext(UserContext);

  const [user, setUser] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddUserMode, setIsAddUserMode] = useState(false);

  const alertId = useRef(null);

  // componentDidMount
  useEffect(_ => {
    setIsAddUserMode(
      !(Boolean(currentUserToEdit) && Boolean(currentUserToEdit.email))
    );

    if (currentUserToEdit) {
      setUser(currentUserToEdit);
    } else {
      setUser(defaultState);
    }

    return _ => {
      clearCurrentUserToEdit();
      clearAlert();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    _ => {
      if (usersError) {
        setAlert(usersResponseTypes[usersError].msg, 'danger');
        clearUsersError();
      }
    },
    [usersError, setAlert, clearUsersError]
  );

  /* event handlers */

  const onBackToUserList = useCallback(
    _ => {
      clearCurrentUserToEdit();
    },
    [clearCurrentUserToEdit]
  );

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      clearAlert();
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser]
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
            ? uiWordings['UserForm.AddUserSuccessMessage']
            : uiWordings['UserForm.UpdateUserSuccessMessage'],
          'success',
          -1
        );
      }
      setIsSubmitEnabled(false);
    },
    [isAddUserMode, updateUser, addUser, user]
  );

  /* end of event handlers */

  /* methods */

  const clearAlert = useCallback(
    _ => {
      if (alertId.current) {
        removeAlert(alertId.current);
        alertId.current = null;
      }
    },
    [alertId.current]
  );

  /* end of methods */

  const { email, name, password, password2, role } = user;

  return (
    <>
      <button onClick={onBackToUserList}>
        {uiWordings['UserForm.BackToUserList']}
      </button>
      <div className='form-container'>
        <h1>
          {isAddUserMode
            ? uiWordings['UserForm.AddUserTitle']
            : uiWordings['UserForm.EditUserTitle']}
        </h1>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>{uiWordings['UserForm.EmailLabel']}</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              required
            />
          </div>
          {isAddUserMode && (
            <>
              <div className='form-group'>
                <label htmlFor='password'>
                  {uiWordings['UserForm.PasswordLabel']}
                </label>
                <input
                  type='password'
                  name='password'
                  value={password}
                  onChange={onChange}
                  required
                  minLength='6'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password2'>
                  {uiWordings['UserForm.ConfirmPasswordLabel']}
                </label>
                <input
                  type='password'
                  name='password2'
                  value={password2}
                  onChange={onChange}
                  required
                  minLength='6'
                />
              </div>
            </>
          )}
          <div className='form-group'>
            <label htmlFor='name'>{uiWordings['UserForm.NameLabel']}</label>
            <input
              type='text'
              name='name'
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <Select
            name='role'
            value={role}
            options={userRoleOptions}
            label={uiWordings['UserForm.RoleLabel']}
            onChange={onChange}
          />
          <div>
            <input
              disabled={!isSubmitEnabled}
              type='submit'
              value={
                isAddUserMode
                  ? uiWordings['UserForm.AddUserSubmit']
                  : uiWordings['UserForm.UpdateUserSubmit']
              }
              className={`btn btn-primary btn-block ${
                isSubmitEnabled ? '' : 'disabled'
              }`}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UserForm;
