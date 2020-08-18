import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import PageMetaMiscellaneousState from 'contexts/pageMetaMiscellaneous/PageMetaMiscellaneousState';
import uiWordings from 'globals/uiWordings';

const PageMetaMiscellaneousContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['PageMetaMiscellaneous.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <PageMetaMiscellaneousState>
      <div className='page-meta-miscellaneous-container'>{children}</div>
    </PageMetaMiscellaneousState>
  );
};

export default PageMetaMiscellaneousContainer;
