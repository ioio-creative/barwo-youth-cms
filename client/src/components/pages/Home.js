import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';

//import TestFileUpload from 'components/testing/TestFileUpload';

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

  return <div className='w3-container'>{/* <TestFileUpload /> */}</div>;
};

export default Home;
