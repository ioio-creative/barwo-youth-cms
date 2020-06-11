import React from 'react';
import { Toggle } from '@buffetjs/core';

const MyToggle = ({ name, value, onChange }) => {
  return <Toggle name={name} onChange={onChange} value={value} />;
};

MyToggle.defaultProps = {
  onChange: ({ target: { value } }) => {
    console.log(value);
  }
};

export default MyToggle;
