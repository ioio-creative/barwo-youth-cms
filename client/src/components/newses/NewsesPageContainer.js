import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import NewsesState from 'contexts/newses/NewsesState';
import uiWordings from 'globals/uiWordings';

const NewsesPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Newses.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <NewsesState>
      <div className='newses-page-container'>{children}</div>
    </NewsesState>
  );
};

export default NewsesPageContainer;
