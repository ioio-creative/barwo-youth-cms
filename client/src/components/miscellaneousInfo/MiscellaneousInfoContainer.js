import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import MiscellaneousInfoState from 'contexts/miscellaneousInfo/MiscellaneousInfoState';
import uiWordings from 'globals/uiWordings';

const MiscellaneousInfoContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['MiscellaneousInfo.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <MiscellaneousInfoState>
      <div className='miscellaneous-info-container'>{children}</div>
    </MiscellaneousInfoState>
  );
};

export default MiscellaneousInfoContainer;
