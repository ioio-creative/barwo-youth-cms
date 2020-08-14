import React, { useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import TitlebarState from 'contexts/titlebar/TitlebarState';
import AuthContext from 'contexts/auth/authContext';
import AlertContext from 'contexts/alert/alertContext';
import asyncLoadingComponent from 'components/asyncLoading/AsyncLoadingComponent';
import Navbar from 'components/layout/Navbar';
import Titlebar from 'components/layout/Titlebar';
import Alerts from 'components/layout/Alerts';
import routes from 'globals/routes';
import './Main.css';

/* async react components */
// https://objectpartners.com/2018/12/05/migrate-from-react-loadable-to-react-suspense/
const AsyncHome = asyncLoadingComponent(_ => import('components/pages/Home'));
const AsyncUserList = asyncLoadingComponent(_ =>
  import('components/pages/UserList')
);
const AsyncUserEdit = asyncLoadingComponent(_ =>
  import('components/pages/UserEdit')
);
const AsyncArtistList = asyncLoadingComponent(_ =>
  import('components/pages/ArtistList')
);
const AsyncArtistEdit = asyncLoadingComponent(_ =>
  import('components/pages/ArtistEdit')
);
const AsyncArtDirectorsOrder = asyncLoadingComponent(_ =>
  import('components/pages/ArtDirectorsOrder')
);
const AsyncArtistsOrder = asyncLoadingComponent(_ =>
  import('components/pages/ArtistsOrder')
);
const AsyncEventList = asyncLoadingComponent(_ =>
  import('components/pages/EventList')
);
const AsyncEventEdit = asyncLoadingComponent(_ =>
  import('components/pages/EventEdit')
);
const AsyncTicketingDefaultEdit = asyncLoadingComponent(_ =>
  import('components/pages/TicketingDefaultEdit')
);
const AsyncPhaseList = asyncLoadingComponent(_ =>
  import('components/pages/PhaseList')
);
const AsyncPhaseEdit = asyncLoadingComponent(_ =>
  import('components/pages/PhaseEdit')
);
const AsyncTesting = asyncLoadingComponent(_ =>
  import('components/pages/Testing')
);
const AsyncFileManager = asyncLoadingComponent(_ =>
  import('components/pages/FileManager')
);
const AsyncEditPassword = asyncLoadingComponent(_ =>
  import('components/pages/PasswordEdit')
);
const AsyncLandingPage = asyncLoadingComponent(_ =>
  import('components/pages/LandingPageEdit')
);
const AsyncGlobalConstantsEdit = asyncLoadingComponent(_ =>
  import('components/pages/GlobalConstantsEdit')
);
const AsyncMiscellaneousInfo = asyncLoadingComponent(_ =>
  import('components/pages/MiscellaneousInfoEdit')
);
const AsyncContactList = asyncLoadingComponent(_ =>
  import('components/pages/ContactList')
);
const AsyncContactEdit = asyncLoadingComponent(_ =>
  import('components/pages/ContactEdit')
);
const AsyncActivityList = asyncLoadingComponent(_ =>
  import('components/pages/ActivityList')
);
const AsyncActivityEdit = asyncLoadingComponent(_ =>
  import('components/pages/ActivityEdit')
);
const AsyncNewsList = asyncLoadingComponent(_ =>
  import('components/pages/NewsList')
);
const AsyncNewsEdit = asyncLoadingComponent(_ =>
  import('components/pages/NewsEdit')
);
const AsyncNewsesOrder = asyncLoadingComponent(_ =>
  import('components/pages/NewsesOrder')
);
const AsyncNewsMediaItemList = asyncLoadingComponent(_ =>
  import('components/pages/NewsMediaItemList')
);
const AsyncNewsMediaItemEdit = asyncLoadingComponent(_ =>
  import('components/pages/NewsMediaItemEdit')
);
const AsyncNewsletterList = asyncLoadingComponent(_ =>
  import('components/pages/NewsletterList')
);
const AsyncNewsletterEdit = asyncLoadingComponent(_ =>
  import('components/pages/NewsletterEdit')
);
const AsyncNewsletterOrder = asyncLoadingComponent(_ =>
  import('components/pages/NewsletterOrder')
);
const AsyncAboutEdit = asyncLoadingComponent(_ =>
  import('components/pages/AboutEdit')
);
const AsyncSendHistoryList = asyncLoadingComponent(_ =>
  import('components/pages/SendHistoryList')
);
const AsyncSendHistoryView = asyncLoadingComponent(_ =>
  import('components/pages/SendHistoryView')
);
const AsyncSenderEdit = asyncLoadingComponent(_ =>
  import('components/pages/SenderEdit')
);

const Main = _ => {
  const { loadUser } = useContext(AuthContext);
  const { removeAlerts } = useContext(AlertContext);
  // componentDidMount
  useEffect(_ => {
    console.log('Main componentDidMount');
    loadUser();
    // remove alerts lingering from login
    removeAlerts();
    // eslint-disable-next-line
  }, []);
  return (
    <div className='main'>
      <Navbar className='my-navbar' />
      <TitlebarState>
        <div className='my-main'>
          <Titlebar />
          <div className='w3-container'>
            <Alerts />
            {/*
              Switch component behaves similarly to the "switch" construct
              in programming. Once a Route is matched, subsequent Routes
              will be ignored. So we should use "exact" keyword on more
              generic paths, like "/", or put more generic paths as the
              later Routes in the Route list.
            */}
            <Switch>
              <Route exact path={routes.home(false)} component={AsyncHome} />

              <Route path={routes.editPassword} component={AsyncEditPassword} />

              <Route path={routes.userList(false)} component={AsyncUserList} />
              <Route path={routes.userEditById} component={AsyncUserEdit} />
              <Route path={routes.userAdd(false)} component={AsyncUserEdit} />

              <Route
                path={routes.artistList(false)}
                component={AsyncArtistList}
              />
              <Route path={routes.artistEditById} component={AsyncArtistEdit} />
              <Route
                path={routes.artistAdd(false)}
                component={AsyncArtistEdit}
              />

              <Route
                path={routes.artDirectorsOrder(false)}
                component={AsyncArtDirectorsOrder}
              />
              <Route
                path={routes.artistsOrder(false)}
                component={AsyncArtistsOrder}
              />

              <Route
                path={routes.eventList(false)}
                component={AsyncEventList}
              />
              <Route path={routes.eventEditById} component={AsyncEventEdit} />
              <Route path={routes.eventAdd(false)} component={AsyncEventEdit} />

              {/* Community Performances would use the same components as Events. */}
              <Route
                path={routes.communityPerformanceList(false)}
                component={AsyncEventList}
              />
              <Route
                path={routes.communityPerformanceEditById}
                component={AsyncEventEdit}
              />
              <Route
                path={routes.communityPerformanceAdd(false)}
                component={AsyncEventEdit}
              />

              <Route
                path={routes.ticketingDefaultEdit(false)}
                component={AsyncTicketingDefaultEdit}
              />

              <Route
                path={routes.phaseList(false)}
                component={AsyncPhaseList}
              />
              <Route path={routes.phaseEditById} component={AsyncPhaseEdit} />
              <Route path={routes.phaseAdd(false)} component={AsyncPhaseEdit} />

              <Route
                path={routes.aboutEdit(false)}
                component={AsyncAboutEdit}
              />

              <Route
                path={routes.globalConstantsEdit(false)}
                component={AsyncGlobalConstantsEdit}
              />

              <Route
                path={routes.landingPageEdit(false)}
                component={AsyncLandingPage}
              />

              <Route
                path={routes.miscellaneousInfoEdit(false)}
                component={AsyncMiscellaneousInfo}
              />

              <Route
                path={routes.contactList(false)}
                component={AsyncContactList}
              />
              <Route
                path={routes.contactEditById}
                component={AsyncContactEdit}
              />
              <Route
                path={routes.contactAdd(false)}
                component={AsyncContactEdit}
              />

              <Route
                path={routes.newsletterList(false)}
                component={AsyncNewsletterList}
              />
              <Route
                path={routes.newsletterEditById}
                component={AsyncNewsletterEdit}
              />
              <Route
                path={routes.newsletterAdd(false)}
                component={AsyncNewsletterEdit}
              />
              <Route
                path={routes.newsletterOrder(false)}
                component={AsyncNewsletterOrder}
              />

              <Route
                path={routes.sendHistoryList(false)}
                component={AsyncSendHistoryList}
              />
              <Route
                path={routes.sendHistoryViewById}
                component={AsyncSendHistoryView}
              />
              <Route
                path={routes.newsletterAdd(false)}
                component={AsyncNewsletterEdit}
              />
              <Route
                path={routes.senderEdit(false)}
                component={AsyncSenderEdit}
              />

              <Route
                path={routes.activityList(false)}
                component={AsyncActivityList}
              />
              <Route
                path={routes.activityEditById}
                component={AsyncActivityEdit}
              />
              <Route
                path={routes.activityAdd(false)}
                component={AsyncActivityEdit}
              />

              <Route path={routes.newsList(false)} component={AsyncNewsList} />
              <Route path={routes.newsEditById} component={AsyncNewsEdit} />
              <Route path={routes.newsAdd(false)} component={AsyncNewsEdit} />
              <Route
                path={routes.newsesOrder(false)}
                component={AsyncNewsesOrder}
              />

              <Route
                path={routes.newsMediaItemList(false)}
                component={AsyncNewsMediaItemList}
              />
              <Route
                path={routes.newsMediaItemEditById}
                component={AsyncNewsMediaItemEdit}
              />
              <Route
                path={routes.newsMediaItemAdd(false)}
                component={AsyncNewsMediaItemEdit}
              />

              <Route path={routes.testing} component={AsyncTesting} />
              <Route path={routes.fileManager} component={AsyncFileManager} />

              <Route component={AsyncHome} />
            </Switch>
          </div>
        </div>
      </TitlebarState>
    </div>
  );
};

export default Main;
