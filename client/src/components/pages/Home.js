import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import RichTextbox from 'components/form/RichTextbox';

const Home = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle('Homepage');
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return <div className='w3-container'>Homepage
    <RichTextbox />
  </div>;
};

export default Home;
