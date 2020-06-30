import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import LandingPageState from 'contexts/landingPage/LandingPageState';
import uiWordings from 'globals/uiWordings';

const ArtistsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['LandingPage.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <LandingPageState>
      <div className='landing-page-container'>{children}</div>
    </LandingPageState>
  );
};

export default ArtistsPageContainer;
