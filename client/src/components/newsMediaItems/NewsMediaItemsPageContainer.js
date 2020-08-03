import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import NewsMediaItemsState from 'contexts/newsMediaItems/NewsMediaItemsState';
import uiWordings from 'globals/uiWordings';

const NewsMediaItemsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['NewsMediaItems.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <NewsMediaItemsState>
      <div className='news-media-items-page-container'>{children}</div>
    </NewsMediaItemsState>
  );
};

export default NewsMediaItemsPageContainer;
