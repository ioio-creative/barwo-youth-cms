import React, { useContext, useState, useEffect, useCallback } from 'react';
import AlertContext from 'contexts/alert/alertContext';
import UserContext from 'contexts/users/usersContext';
import userRoles from 'types/userRoles';
import uiWordings from 'globals/uiWordings';

const defaultState = {
  email: '',
  password: '',
  name: '',
  role: userRoles.NORMAL_USER._id,

  password2: ''
};

const ContactForm = _ => {
  const { setAlert } = useContext(AlertContext);
  const {
    currentUserToEdit,
    addUser,
    updateUser,
    clearCurrentUserToEdit
  } = useContext(UserContext);

  const [user, setUser] = useState(defaultState);

  useEffect(
    _ => {
      if (currentUserToEdit) {
        setUser(currentUserToEdit);
      } else {
        setUser(defaultState);
      }
    },
    [currentUserToEdit, setUser]
  );

  const { email, name, password, password2, role } = user;

  const onChange = useCallback(
    e => {
      setUser({ ...user, [e.target.name]: e.target.value });
    },
    [user, setUser]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      if (currentUserToEdit) {
        const { password2, ...cleanedUser } = user;
        await updateUser(cleanedUser);
      } else {
        await addUser(cleanedUser);
      }
    },
    [currentUserToEdit, updateUser, addUser]
  );

  const clearAll = useCallback(
    e => {
      clearCurrentUserToEdit();
    },
    [clearCurrentUserToEdit]
  );

  return (
    <div className='form-container'>
      <h1>
      {currentUserToEdit
          ? uiWordings['UserForm.EditUserTitle']
          : uiWordings['UserForm.AddUserTitle']}
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
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
          <label htmlFor='password2'>Confirm Password</label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <input
          type='submit'
          value='Register'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        
      </h2>
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={email}
        onChange={onChange}
        required
      />
      <input
        type='text'
        placeholder='Name'
        name='name'
        value={name}
        onChange={onChange}
        required
      />
      <h5>Contact Type</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={onChange}
        required
      />{' '}
      Personal{' '}
      <input
        type='radio'
        name='type'
        value='professional'
        checked={type === 'professional'}
        onChange={onChange}
      />{' '}
      Professional
      <div>
        <input
          type='submit'
          value={current ? 'Update Contact' : 'Add Contact'}
          className='
        btn btn-primary btn-block'
        />
      </div>
      {current && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
