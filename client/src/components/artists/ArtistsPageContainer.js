import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import ArtistsState from 'contexts/artists/ArtistsState';
import uiWordings from 'globals/uiWordings';

const ArtistsPageContainer = ({ children }) => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['Artists.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ArtistsState>
      <div className='artists-page-container'>{children}</div>
    </ArtistsState>
  );
};

export default ArtistsPageContainer;
