import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import EventsState from 'contexts/events/EventsState';
import uiWordings from 'globals/uiWordings';

const EventsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Events.Title']);
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
