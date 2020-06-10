import React from 'react';
import { Select } from '@buffetjs/core';

const MySelect = ({ name, value, options, onChange }) => {
  return (
    <Select name={name} onChange={onChange} options={options} value={value} />
  );
};

MySelect.defaultProps = {
  onChange: ({ target: { value } }) => {
    console.log(value);
  }
};

export default MySelect;
