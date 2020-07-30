import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import SenderState from 'contexts/sender/SenderState';
import uiWordings from 'globals/uiWordings';

const SenderPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Sender.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <SenderState>
      <div className='sender-page-container'>{children}</div>
    </SenderState>
  );
};

export default SenderPageContainer;
