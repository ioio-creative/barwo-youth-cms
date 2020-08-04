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
  const { logout, authUser, isAuthUserAdmin } = useContext(AuthContext);

  const isPasswordChange = useRouteMatch(routes.editPassword);
  const isUserList = useRouteMatch(routes.userList(false));
  const isUserEdit = useRouteMatch(routes.userEditById);
  const isUserAdd = useRouteMatch(routes.userAdd(false));

  const isAboutEdit = useRouteMatch(routes.aboutEdit(false));

  const isGlobalConstantsEdit = useRouteMatch(
    routes.globalConstantsEdit(false)
  );
  const isLandingPageEdit = useRouteMatch(routes.landingPageEdit(false));

  const isPhaseList = useRouteMatch(routes.phaseList(false));
  const isPhaseEdit = useRouteMatch(routes.phaseEditById);
  const isPhaseAdd = useRouteMatch(routes.phaseAdd(false));

  const isEventList = useRouteMatch(routes.eventList(false));
  const isEventEdit = useRouteMatch(routes.eventEditById);
  const isEventAdd = useRouteMatch(routes.eventAdd(false));

  const isTicketingDefaultEdit = useRouteMatch(
    routes.ticketingDefaultEdit(false)
  );

  const isArtistList = useRouteMatch(routes.artistList(false));
  const isArtistEdit = useRouteMatch(routes.artistEditById);
  const isArtistAdd = useRouteMatch(routes.artistAdd(false));
  const isArtDirectorsOrder = useRouteMatch(routes.artDirectorsOrder(false));
  const isArtistsOrder = useRouteMatch(routes.artistsOrder(false));

  const isActivityList = useRouteMatch(routes.activityList(false));
  const isActivityEdit = useRouteMatch(routes.activityEditById);
  const isActivityAdd = useRouteMatch(routes.activityAdd(false));

  const isNewsList = useRouteMatch(routes.newsList(false));
  const isNewsEdit = useRouteMatch(routes.newsEditById);
  const isNewsAdd = useRouteMatch(routes.newsAdd(false));
  const isNewsesOrder = useRouteMatch(routes.newsesOrder(false));

  const isNewsMediaItemList = useRouteMatch(routes.newsMediaItemList(false));
  const isNewsMediaItemEdit = useRouteMatch(routes.newsMediaItemEditById);
  const isNewsMediaItemAdd = useRouteMatch(routes.newsMediaItemAdd(false));

  const isContactList = useRouteMatch(routes.contactList(false));
  const isContactEdit = useRouteMatch(routes.contactEditById);
  const isContactAdd = useRouteMatch(routes.contactAdd(false));

  const isNewsletterList = useRouteMatch(routes.newsletterList(false));
  const isNewsletterEdit = useRouteMatch(routes.newsletterEditById);
  const isNewsletterAdd = useRouteMatch(routes.newsletterAdd(false));

  const isSendHistoryList = useRouteMatch(routes.sendHistoryList(false));
  const isSendHistoryView = useRouteMatch(routes.sendHistoryViewById);

  const isSenderEdit = useRouteMatch(routes.senderEdit(false));

  const isTesting = useRouteMatch(routes.testing);

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
      <NavbarLink
        to={routes.editPasswordWithId(true, authUser ? authUser._id : '')}
        isSelected={isPasswordChange}
      >
        {uiWordings['Navbar.PasswordEdit']}
      </NavbarLink>
      <NavbarButton className='w3-border-bottom' onClick={onLogout}>
        <i className='fa fa-sign-out' /> {uiWordings['Navbar.Logout']}
      </NavbarButton>
      {isAuthUserAdmin && (
        <NavbarLink
          className='w3-border-bottom'
          to={routes.userList(true)}
          isSelected={isUserList || isUserEdit || isUserAdd}
        >
          {uiWordings['Navbar.Users']}
        </NavbarLink>
      )}

      <NavbarLink
        to={routes.globalConstantsEdit(true)}
        isSelected={isGlobalConstantsEdit}
      >
        {uiWordings['Navbar.GlobalConstants']}
      </NavbarLink>
      <NavbarLink
        to={routes.landingPageEdit(true)}
        isSelected={isLandingPageEdit}
      >
        {uiWordings['Navbar.LandingPage']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.aboutEdit(true)}
        isSelected={isAboutEdit}
      >
        {uiWordings['Navbar.About']}
      </NavbarLink>

      <NavbarLink
        className='w3-border-bottom'
        to={routes.phaseList(true)}
        isSelected={isPhaseList || isPhaseEdit || isPhaseAdd}
      >
        {uiWordings['Navbar.Phases']}
      </NavbarLink>
      <NavbarLink
        to={routes.eventList(true)}
        isSelected={isEventList || isEventEdit || isEventAdd}
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
        isSelected={
          isArtistList ||
          isArtistEdit ||
          isArtistAdd ||
          isArtDirectorsOrder ||
          isArtistsOrder
        }
      >
        {uiWordings['Navbar.Artists']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.activityList(true)}
        isSelected={isActivityList || isActivityEdit || isActivityAdd}
      >
        {uiWordings['Navbar.Activities']}
      </NavbarLink>
      <NavbarLink
        //className='w3-border-bottom'
        to={routes.newsList(true)}
        isSelected={isNewsList || isNewsEdit || isNewsAdd || isNewsesOrder}
      >
        {uiWordings['Navbar.Newses']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.newsMediaItemList(true)}
        isSelected={
          isNewsMediaItemList || isNewsMediaItemEdit || isNewsMediaItemAdd
        }
      >
        {uiWordings['Navbar.NewsMediaItems']}
      </NavbarLink>
      <NavbarLink
        // className='w3-border-bottom'
        to={routes.newsletterList(true)}
        isSelected={
          isNewsletterList ||
          isNewsletterEdit ||
          isNewsletterAdd ||
          isSendHistoryList ||
          isSendHistoryView
        }
      >
        {uiWordings['Navbar.Newsletters']}
      </NavbarLink>
      <NavbarLink
        // className='w3-border-bottom'
        to={routes.contactList(true)}
        isSelected={isContactList || isContactEdit || isContactAdd}
      >
        {uiWordings['Navbar.Contacts']}
      </NavbarLink>
      <NavbarLink
        className='w3-border-bottom'
        to={routes.senderEdit(true)}
        isSelected={isSenderEdit}
      >
        {uiWordings['Navbar.SenderEdit']}
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
