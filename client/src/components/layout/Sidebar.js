import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

const Sidebar = ({ title, icon }) => {
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
        <Link to={routes.users(true)}>
          <a href='#' className='w3-bar-item w3-button'>
            {uiWordings['Navbar.Users']}
          </a>
        </Link>
      )}
      {authUser && (
        <div>{`${authUser.name}, ${uiWordings['Navbar.Greeting']}`}</div>
      )}
      <a href='#!' className='w3-bar-item w3-button' onClick={onLogout}>
        <FontAwesomeIcon icon='sign-out-alt' />{' '}
        <span className='hide-sm'>{uiWordings['Navbar.Logout']}</span>
      </a>
    </>
  );

  const guestLinks = (
    <>
      <Link to={routes.login(true)}>
        <a href='#' className='w3-bar-item w3-button'>
          {uiWordings['Navbar.Login']}
        </a>
      </Link>
    </>
  );

  return (
    <div class='w3-sidebar w3-bar-block' style={{ width: '25%' }}>
      <h1>
        <FontAwesomeIcon icon={icon} /> {title}
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
      <a href='#' className='w3-bar-item w3-button'>
        Link 1
      </a>
      <a href='#' className='w3-bar-item w3-button'>
        Link 2
      </a>
      <a href='#' className='w3-bar-item w3-button'>
        Link 3
      </a>
    </div>
  );
};

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ])
};

Sidebar.defaultProps = {
  title: uiWordings['Navbar.Title'],
  icon: 'id-card-alt'
};

export default Sidebar;
