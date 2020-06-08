import React from 'react';
import { InputText } from '@buffetjs/core';

// https://www.buffetjs.io/storybook/?path=/story/components--inputtext
const MyInputText = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  required
}) => {
  const extraProps = {};
  if (required) {
    extraProps.required = true;
  }
  return (
    <InputText
      className='w3-margin-bottom'
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      {...extraProps}
    />
  );
};

MyInputText.defaultProps = {
  type: 'text',
  placeholder: ''
};

export default MyInputText;
