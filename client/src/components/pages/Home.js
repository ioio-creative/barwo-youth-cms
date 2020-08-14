import React, { useContext, useEffect } from 'react';
import TitlebarContext from 'contexts/titlebar/titlebarContext';
import uiWordings from 'globals/uiWordings';

//import TestFileUpload from 'components/testing/TestFileUpload';
// import TestSearch from 'components/testing/TestSearch';
// import TestContactAdd from 'components/testing/TestContactAdd';

const Home = _ => {
  const { setTitle, removeTitle } = useContext(TitlebarContext);

  // componentDidMount
  useEffect(_ => {
    setTitle(uiWordings['HomePage.Title']);
    return _ => {
      removeTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className='w3-container'>
      {/* <TestFileUpload /> */}
      {/* <TestSearch /> */}
      {/* <TestContactAdd /> */}
    </div>
  );
};

export default Home;
