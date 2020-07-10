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
                path={routes.eventList(false)}
                component={AsyncEventList}
              />
              <Route path={routes.eventEditById} component={AsyncEventEdit} />
              <Route path={routes.eventAdd(false)} component={AsyncEventEdit} />

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
                path={routes.globalConstantsEdit(false)}
                component={AsyncGlobalConstantsEdit}
              />

              <Route
                path={routes.landingPageEdit(false)}
                component={AsyncLandingPage}
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
