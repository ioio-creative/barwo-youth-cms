import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import PhasesState from 'contexts/phases/PhasesState';
import uiWordings from 'globals/uiWordings';

const PhasesPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Phases.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <PhasesState>
      <div className='phases-page-container'>{children}</div>
    </PhasesState>
  );
};

export default PhasesPageContainer;
