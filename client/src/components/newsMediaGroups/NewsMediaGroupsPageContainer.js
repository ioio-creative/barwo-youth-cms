import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import NewsMediaGroupsState from 'contexts/newsMediaGroups/NewsMediaGroupsState';
import uiWordings from 'globals/uiWordings';

const NewsMediaGroupsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['NewsMediaGroups.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <NewsMediaGroupsState>
      <div className='news-media-groups-page-container'>{children}</div>
    </NewsMediaGroupsState>
  );
};

export default NewsMediaGroupsPageContainer;
