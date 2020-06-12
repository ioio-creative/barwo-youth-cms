import React, { useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from 'contexts/auth/authContext';
import routes from 'globals/routes';
import uiWordings from 'globals/uiWordings';

const NavbarItem = ({ className, children }) => {
  return <div className={`w3-bar-item ${className}`}>{children}</div>;
};

NavbarItem.defaultProps = {
  className: ''
};

const NavbarButton = ({ className, children, onClick }) => {
  return (
    <button className={`w3-bar-item w3-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

NavbarButton.defaultProps = {
  className: ''
};

const NavbarLink = ({ className, children, to }) => {
  return (
    <Link className={`w3-bar-item w3-button ${className}`} to={to}>
      {children}
    </Link>
  );
};

NavbarLink.defaultProps = {
  className: ''
};

// https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_sidebar
const Navbar = ({ className }) => {
  const { logout, authUser, isAuthUserAdmin } = useContext(AuthContext);

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
      {authUser && (
        <NavbarItem>{`${authUser.name}, ${uiWordings['Navbar.Greeting']}`}</NavbarItem>
      )}
      <NavbarButton className='w3-border-bottom' onClick={onLogout}>
        <i className='fa fa-sign-out' /> {uiWordings['Navbar.Logout']}
      </NavbarButton>
      {isAuthUserAdmin && (
        <NavbarLink to={routes.userList(true)}>
          {uiWordings['Navbar.Users']}
        </NavbarLink>
      )}
      <NavbarLink to={routes.artistList(true)}>
        {uiWordings['Navbar.Artists']}
      </NavbarLink>
    </>
  );

  return (
    <div
      className={`w3-sidebar w3-bar-block w3-light-grey w3-card ${className}`}
    >
      <NavbarLink className='w3-border-bottom w3-large' to={routes.home()}>
        {uiWordings['Navbar.Title']}{' '}
      </NavbarLink>
      {links}
    </div>
  );
};

export default Navbar;
