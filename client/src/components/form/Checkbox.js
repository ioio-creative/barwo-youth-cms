import React from 'react';
import { Checkbox } from '@buffetjs/core';

// https://buffetjs.io/storybook/?path=/story/components--checkbox
const MyCheckbox = ({ message, name, value, onChange }) => {
  return (
    <Checkbox message={message} name={name} onChange={onChange} value={value} />
  );
};

MyCheckbox.defaultProps = {
  message: 'Check me',
  name: 'checkbox',
  value: true,
  onChange: ({ target: { value } }) => {
    console.log(value);
  }
};

export default MyCheckbox;
