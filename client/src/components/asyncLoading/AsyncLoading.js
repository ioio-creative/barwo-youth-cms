import './AsyncLoading.css';

import React from 'react';
import Loading from 'components/layout/loading/DefaultLoading';

export default ({ isLoading, error }) => {
  let loadScreen;
  // Handle the loading state
  if (isLoading) {
    loadScreen = (
      <div className='loading-screen'>
        <Loading />
      </div>
    );
  }
  // Handle the error state
  else if (error) {
    //alert(error);
    console.error(error);
    loadScreen = (
      <div className='loading-error'>
        Sorry, there was a problem loading the page.
      </div>
    );
  } else {
    return null;
  }

  return <div className='default-loading'>{loadScreen}</div>;
};
