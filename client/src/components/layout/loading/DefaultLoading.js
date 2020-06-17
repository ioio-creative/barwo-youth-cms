import React from 'react';
import './DefaultLoading.css';

// https://objectpartners.com/2018/12/05/migrate-from-react-loadable-to-react-suspense/
const Loading = _ => {
  return (
    <div className='default-loading'>
      <div className='loader' />
    </div>
  );
};

export default Loading;
