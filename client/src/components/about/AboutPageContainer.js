import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import AboutState from 'contexts/about/AboutState';
import uiWordings from 'globals/uiWordings';

const AboutPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['About.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <AboutState>
      <div className='about-page-container'>{children}</div>
    </AboutState>
  );
};

export default AboutPageContainer;
