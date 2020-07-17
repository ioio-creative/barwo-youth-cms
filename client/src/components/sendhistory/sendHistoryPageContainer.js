import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import SendHistoriesState from 'contexts/sendHistories/SendHistoriesState';
import uiWordings from 'globals/uiWordings';

const SendHistoriesPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['SendHistories.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <SendHistoriesState>
      <div className='send-histories-page-container'>{children}</div>
    </SendHistoriesState>
  );
};

export default SendHistoriesPageContainer;
