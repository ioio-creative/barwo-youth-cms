import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from 'contexts/auth/authContext';

const Navbar = ({ title, icon }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const onLogout = _ => {
    logout();
  };

  const authLinks = (
    <>
      <li>Hello {user && user.name}</li>
      <li>
        <a href='#!' onClick={onLogout}>
          <FontAwesomeIcon icon='sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to='/login'>Login</Link>
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
  title: 'Contact Keeper',
  icon: 'id-card-alt'
};

export default Navbar;
