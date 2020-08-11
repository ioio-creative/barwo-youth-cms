import React, { useContext, useEffect, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import EventsState from 'contexts/events/EventsState';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';

const EventsPageContainer = ({ children }) => {
  const isCommunityPerformanceList = Boolean(
    useRouteMatch(routes.communityPerformanceList(false))
  );
  const isCommunityPerformanceEdit = Boolean(
    useRouteMatch(routes.communityPerformanceEditById)
  );
  const isCommunityPerformanceAdd = Boolean(
    useRouteMatch(routes.communityPerformanceAdd(false))
  );
  const isCommunityPerformancePage = useMemo(
    _ => {
      return (
        isCommunityPerformanceList ||
        isCommunityPerformanceEdit ||
        isCommunityPerformanceAdd
      );
    },
    [
      isCommunityPerformanceList,
      isCommunityPerformanceEdit,
      isCommunityPerformanceAdd
    ]
  );

  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(
      uiWordings[
        `${
          isCommunityPerformancePage
            ? 'CommunityPerformances.Title'
            : 'Events.Title'
        }`
      ]
    );
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <EventsState>
      <div className='events-page-container'>{children}</div>
    </EventsState>
  );
};

export default EventsPageContainer;
