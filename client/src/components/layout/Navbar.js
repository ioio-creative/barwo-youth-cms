import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

// https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_examples_material
// Change style of top container on scroll
window.onscroll = _ => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document
      .getElementById('myTop')
      .classList.add('w3-card-4', 'w3-animate-opacity');
    document.getElementById('myIntro').classList.add('w3-show-inline-block');
  } else {
    document.getElementById('myIntro').classList.remove('w3-show-inline-block');
    document
      .getElementById('myTop')
      .classList.remove('w3-card-4', 'w3-animate-opacity');
  }
};

// Open and close the sidebar on medium and small screens
const w3_close = _ => {
  document.getElementById('mySidebar').style.display = 'none';
  document.getElementById('myOverlay').style.display = 'none';
};

// Accordions
const myAccordion = id => {
  var x = document.getElementById(id);
  if (x.className.indexOf('w3-show') == -1) {
    x.className += ' w3-show';
    x.previousElementSibling.className += ' w3-theme';
  } else {
    x.className = x.className.replace('w3-show', '');
    x.previousElementSibling.className = x.previousElementSibling.className.replace(
      ' w3-theme',
      ''
    );
  }
};

const Navbar = ({ title, icon }) => {
  const { isAuthenticated, logout, authUser, isAuthUserAdmin } = useContext(
    AuthContext
  );

  /* event handlers */

  const onLogout = useCallback(
    _ => {
      logout();
    },
    [logout]
  );

  /* end of event handlers */

  const links = (
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
        <i className='fas fa-sign-out-alt' />{' '}
        <span className='hide-sm'>{uiWordings['Navbar.Logout']}</span>
      </a>
    </>
  );

  return (
    <>
      <nav
        id='mySidebar'
        className='w3-sidebar w3-bar-block w3-collapse w3-animate-left w3-card'
      >
        <a className='w3-bar-item w3-button w3-border-bottom w3-large' href='#'>
          <img
            src='https://www.w3schools.com/images/w3schools.png'
            style={{ width: '80%' }}
          />
        </a>
        <a
          className='w3-bar-item w3-button w3-hide-large w3-large'
          onClick={w3_close}
        >
          Close <i className='fa fa-remove'></i>
        </a>
        <a className='w3-bar-item w3-button w3-teal' href='#'>
          Home
        </a>
        <a className='w3-bar-item w3-button' href='#'>
          Link 1
        </a>
        <a className='w3-bar-item w3-button' href='#'>
          Link 2
        </a>
        <a className='w3-bar-item w3-button' href='#'>
          Link 3
        </a>
        <a className='w3-bar-item w3-button' href='#'>
          Link 4
        </a>
        <a className='w3-bar-item w3-button' href='#'>
          Link 5
        </a>
        {links}
      </nav>
      <div
        className='w3-overlay w3-hide-large w3-animate-opacity'
        onClick={w3_close}
        style={{ cursor: 'pointer' }}
        id='myOverlay'
      />
    </>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

Navbar.defaultProps = {
  title: uiWordings['Navbar.Title'],
  icon: 'fas fa-id-card-alt'
};

export default Navbar;
