import React from 'react';
import { InputText } from '@buffetjs/core';

// https://www.buffetjs.io/storybook/?path=/story/components--inputtext
const MyInputText = ({
  className,
  type,
  name,
  value,
  placeholder,
  onChange,
  required,
  minLength
}) => {
  const extraProps = {};
  if (required) {
    extraProps.required = true;
  }
  if (minLength) {
    extraProps.minLength = minLength;
  }
  return (
    <InputText
      className={`w3-margin-bottom ${className}`}
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
  className: '',
  type: 'text',
  placeholder: ''
};

export default MyInputText;
