import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import ActivitiesState from 'contexts/activities/ActivitiesState';
import uiWordings from 'globals/uiWordings';

const ActivitiesPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Activities.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ActivitiesState>
      <div className='activities-page-container'>{children}</div>
    </ActivitiesState>
  );
};

export default ActivitiesPageContainer;
