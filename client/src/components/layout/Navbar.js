import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

const Navbar = ({ title, icon }) => {
  const { isAuthenticated, logout, authUser, isAuthUserAdmin } = useContext(
    AuthContext
  );

  const onLogout = useCallback(
    _ => {
      logout();
    },
    [logout]
  );

  const authLinks = (
    <>
      {isAuthUserAdmin && (
        <li>
          <Link to={routes.users(true)}>{uiWordings['Navbar.Users']}</Link>
        </li>
      )}
      {authUser && (
        <li>{`${authUser.name}, ${uiWordings['Navbar.Greeting']}`}</li>
      )}
      <li>
        <a href='#!' onClick={onLogout}>
          <FontAwesomeIcon icon='sign-out-alt' />{' '}
          <span className='hide-sm'>{uiWordings['Navbar.Logout']}</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to={routes.login(true)}>{uiWordings['Navbar.Login']}</Link>
      </li>
    </>
  );

  return (
    <div className='navbar bg-primary'>
      <h1>
        <FontAwesomeIcon icon={icon} /> {title}
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ])
};

Navbar.defaultProps = {
  title: uiWordings['Navbar.Title'],
  icon: 'id-card-alt'
};

export default Navbar;
