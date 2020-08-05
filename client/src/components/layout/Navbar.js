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

  const isPasswordChange = Boolean(useRouteMatch(routes.editPassword));
  const isUserList = Boolean(useRouteMatch(routes.userList(false)));
  const isUserEdit = Boolean(useRouteMatch(routes.userEditById));
  const isUserAdd = Boolean(useRouteMatch(routes.userAdd(false)));

  const isAboutEdit = Boolean(useRouteMatch(routes.aboutEdit(false)));

  const isGlobalConstantsEdit = Boolean(
    useRouteMatch(routes.globalConstantsEdit(false))
  );
  const isLandingPageEdit = Boolean(
    useRouteMatch(routes.landingPageEdit(false))
  );

  const isPhaseList = Boolean(useRouteMatch(routes.phaseList(false)));
  const isPhaseEdit = Boolean(useRouteMatch(routes.phaseEditById));
  const isPhaseAdd = Boolean(useRouteMatch(routes.phaseAdd(false)));

  const isEventList = Boolean(useRouteMatch(routes.eventList(false)));
  const isEventEdit = Boolean(useRouteMatch(routes.eventEditById));
  const isEventAdd = Boolean(useRouteMatch(routes.eventAdd(false)));

  const isTicketingDefaultEdit = Boolean(
    useRouteMatch(routes.ticketingDefaultEdit(false))
  );

  const isArtistList = Boolean(useRouteMatch(routes.artistList(false)));
  const isArtistEdit = Boolean(useRouteMatch(routes.artistEditById));
  const isArtistAdd = Boolean(useRouteMatch(routes.artistAdd(false)));
  const isArtDirectorsOrder = Boolean(
    useRouteMatch(routes.artDirectorsOrder(false))
  );
  const isArtistsOrder = Boolean(useRouteMatch(routes.artistsOrder(false)));

  const isActivityList = Boolean(useRouteMatch(routes.activityList(false)));
  const isActivityEdit = Boolean(useRouteMatch(routes.activityEditById));
  const isActivityAdd = Boolean(useRouteMatch(routes.activityAdd(false)));

  const isNewsList = Boolean(useRouteMatch(routes.newsList(false)));
  const isNewsEdit = Boolean(useRouteMatch(routes.newsEditById));
  const isNewsAdd = Boolean(useRouteMatch(routes.newsAdd(false)));
  const isNewsesOrder = Boolean(useRouteMatch(routes.newsesOrder(false)));

  const isNewsMediaItemList = Boolean(
    useRouteMatch(routes.newsMediaItemList(false))
  );
  const isNewsMediaItemEdit = Boolean(
    useRouteMatch(routes.newsMediaItemEditById)
  );
  const isNewsMediaItemAdd = Boolean(
    useRouteMatch(routes.newsMediaItemAdd(false))
  );

  const isContactList = Boolean(useRouteMatch(routes.contactList(false)));
  const isContactEdit = Boolean(useRouteMatch(routes.contactEditById));
  const isContactAdd = Boolean(useRouteMatch(routes.contactAdd(false)));

  const isNewsletterList = Boolean(useRouteMatch(routes.newsletterList(false)));
  const isNewsletterEdit = Boolean(useRouteMatch(routes.newsletterEditById));
  const isNewsletterAdd = Boolean(useRouteMatch(routes.newsletterAdd(false)));

  const isSendHistoryList = Boolean(
    useRouteMatch(routes.sendHistoryList(false))
  );
  const isSendHistoryView = Boolean(useRouteMatch(routes.sendHistoryViewById));

  const isSenderEdit = Boolean(useRouteMatch(routes.senderEdit(false)));

  const isTesting = Boolean(useRouteMatch(routes.testing));

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
