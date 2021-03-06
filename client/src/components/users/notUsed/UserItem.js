import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import UserContext from 'contexts/users/usersContext';
import User from 'models/user';
import uiWordings from 'globals/uiWordings';

const UserItem = ({ user }) => {
  const { deleteUser, setCurrentUserToEdit } = useContext(UserContext);
  const { _id, name, email, role } = user;

  const onEdit = useCallback(
    _ => {
      setCurrentUserToEdit(user);
    },
    [user, setCurrentUserToEdit]
  );

  const onDelete = useCallback(
    _ => {
      deleteUser(_id);
    },
    [_id, deleteUser]
  );

  return (
    <div className='card bg-light'>
      <h4 className='text-primary text-left'>
        {name}{' '}
        {role && (
          <span
            className={`badge ${
              User.isAdmin(user) ? 'badge-success' : 'badge-primary'
            }`}
            style={{ float: 'right' }}
          >
            {User.userRoles[role].label}
          </span>
        )}
      </h4>
      <ul className='list'>
        {email && (
          <li>
            <i className='fas fa-envelope-open' /> {email}
          </li>
        )}
      </ul>
      <p>
        <button className='btn btn-dark btn-sm' onClick={onEdit}>
          {uiWordings['UserItem.EditUser']}
        </button>
        <button className='btn btn-danger btn-sm' onClick={onDelete}>
          {uiWordings['UserItem.DeleteUser']}
        </button>
      </p>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserItem;
