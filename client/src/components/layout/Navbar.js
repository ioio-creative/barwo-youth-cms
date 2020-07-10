import React, { useContext, useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
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

const NavbarLink = ({ className, children, to, isSelected }) => {
  return (
    <Link
      className={`w3-bar-item w3-button ${
        isSelected ? 'w3-teal' : ''
      } ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};

NavbarLink.defaultProps = {
  className: ''
};

// https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_sidebar
const Navbar = ({ className }) => {
  const isPasswordChange = useRouteMatch(routes.editPassword);
  const isUserList = useRouteMatch(routes.userList(false));
  const isUserEdit = useRouteMatch(routes.userEditById);
  const isGlobalConstantsEdit = useRouteMatch(
    routes.globalConstantsEdit(false)
  );
  const isLandingPageEdit = useRouteMatch(routes.landingPageEdit(false));
  const isPhaseList = useRouteMatch(routes.phaseList(false));
  const isPhaseEdit = useRouteMatch(routes.phaseEditById);
  const isEventList = useRouteMatch(routes.eventList(false));
  const isEventEdit = useRouteMatch(routes.eventEditById);
  const isTicketingDefaultEdit = useRouteMatch(
    routes.ticketingDefaultEdit(false)
  );
  const isArtistList = useRouteMatch(routes.artistList(false));
  const isArtistEdit = useRouteMatch(routes.artistEditById);
  const isContactList = useRouteMatch(routes.contactList(false));
  const isContactEdit = useRouteMatch(routes.contactEditById);
  const isTesting = useRouteMatch(routes.testing);

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
      <NavbarLink to={routes.editPassword} isSelected={isPasswordChange}>
        {uiWordings['Navbar.ChangePasswoed']}
      </NavbarLink>
      <NavbarButton className='w3-border-bottom' onClick={onLogout}>
        <i className='fa fa-sign-out' /> {uiWordings['Navbar.Logout']}
      </NavbarButton>
      {isAuthUserAdmin && (
        <NavbarLink
          className='w3-border-bottom'
          to={routes.userList(true)}
          isSelected={isUserList || isUserEdit}
        >
          {uiWordings['Navbar.Users']}
        </NavbarLink>
      )}
      <NavbarLink
        // className='w3-border-bottom'
        to={routes.globalConstantsEdit(true)}
        isSelected={isGlobalConstantsEdit}
      >
        {uiWordings['Navbar.GlobalConstants']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.landingPageEdit(true)}
        isSelected={isLandingPageEdit}
      >
        {uiWordings['Navbar.LandingPage']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.phaseList(true)}
        isSelected={isPhaseList || isPhaseEdit}
      >
        {uiWordings['Navbar.Phases']}
      </NavbarLink>
      <NavbarLink
        to={routes.eventList(true)}
        isSelected={isEventList || isEventEdit}
      >
        {uiWordings['Navbar.Events']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.ticketingDefaultEdit(true)}
        isSelected={isTicketingDefaultEdit}
      >
        {uiWordings['Navbar.TicketingDefaultEdit']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.artistList(true)}
        isSelected={isArtistList || isArtistEdit}
      >
        {uiWordings['Navbar.Artists']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.contactList(true)}
        isSelected={isContactList || isContactEdit}
      >
        {uiWordings['Navbar.Contacts']}
      </NavbarLink>
      <NavbarLink to={routes.testing} isSelected={isTesting}>
        {uiWordings['Navbar.Testing']}
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
