import React from 'react';
import spinner from './spinner.gif';

export default _ => (
  <img
    src={spinner}
    style={{ width: 200, margin: 'auto', display: 'block' }}
    alt='Loading...'
  />
);
