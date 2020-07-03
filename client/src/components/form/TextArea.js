import React from 'react';
import { InputText } from '@buffetjs/core';
import cleanValueForTextInput from './utils/cleanValueForTextInput';

// https://www.buffetjs.io/storybook/?path=/story/components--inputtext
const MyTextArea = ({
  className,
  type,
  name,
  value,
  placeholder,
  onChange,
  required,
  minLength,
  disabled
}) => {
  const extraProps = {};
  if (required) {
    extraProps.required = true;
  }
  if (minLength) {
    extraProps.minLength = minLength;
  }
  if (disabled) {
    extraProps.disbled = true;
  }

  return (
    <InputText
      className={`${disabled ? 'w3-light-grey' : ''} ${className}`}
      type={type}
      name={name}
      value={cleanValueForTextInput(value)}
      placeholder={placeholder}
      onChange={onChange}
      {...extraProps}
    />
  );
};

MyTextArea.defaultProps = {
  className: '',
  name: '',
  value: '',
  type: 'text',
  placeholder: ''
};

export default MyTextArea;
