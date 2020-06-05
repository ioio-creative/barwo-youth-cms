import React from 'react';
import spinner from './spinner.gif';
import './DefaultLoading.css';

export default _ => (
  <div className='default-loading'>
    <img
      src={spinner}
      style={{ width: 200, margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </div>
);
