import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import NewslettersState from 'contexts/newsletters/NewslettersState';
import uiWordings from 'globals/uiWordings';

const NewsletterPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Newsletter.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <NewslettersState>
      <div className='newsletter-page-container'>{children}</div>
    </NewslettersState>
  );
};

export default NewsletterPageContainer;
