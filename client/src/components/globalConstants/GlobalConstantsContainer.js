import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import GlobalConstantsState from 'contexts/globalConstants/globalConstantsState';
import uiWordings from 'globals/uiWordings';

const GlobalConstantsContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['GlobalConstants.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <GlobalConstantsState>
      <div className='global-constants-page-container'>{children}</div>
    </GlobalConstantsState>
  );
};

export default GlobalConstantsContainer;
