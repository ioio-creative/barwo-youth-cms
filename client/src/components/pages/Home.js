import React, { useContext, useEffect, useRef } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';

import AuthContext from 'contexts/auth/authContext';

import TestFileUpload from 'components/testing/TestFileUpload';

const Home = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);
  const { authUser } = useContext(AuthContext);

  console.log(authUser);

  // componentDidMount
  useEffect(_ => {
    setTitle('Homepage');
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className='w3-container'>
      <TestFileUpload />
    </div>
  );
};

export default Home;
