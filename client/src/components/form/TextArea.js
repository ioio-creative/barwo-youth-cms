import React from 'react';
//import { Textarea } from '@buffetjs/core';
import cleanValueForTextInput from './utils/cleanValueForTextInput';

const defaultStyle = {
  width: '100%',
  height: '5rem',
  padding: '0.6rem 1rem',
  fontWeight: '400',
  fontSize: '1.3rem',
  //cursor: 'pointer',
  outline: '0',
  border: '1px solid #E3E9F3',
  borderRadius: '2px',
  color: '#333740',
  backgroundColor: '#ffffff',
  lineHeight: '18px'
};

const threeRowStyle = {
  height: '7.5rem'
};

// https://www.buffetjs.io/storybook/?path=/story/components--inputtext
const MyTextArea = ({
  className,
  name,
  value,
  placeholder,
  onChange,
  wrap,
  style,
  required,
  maxLength,
  disabled
}) => {
  const extraProps = {};
  if (required) {
    extraProps.required = true;
  }
  if (maxLength) {
    extraProps.minLength = maxLength;
  }
  if (disabled) {
    extraProps.disbled = true;
  }

  return (
    <textarea
      className={`${disabled ? 'w3-light-grey' : ''} ${className}`}
      style={{
        ...defaultStyle,
        ...style
      }}
      name={name}
      value={cleanValueForTextInput(value)}
      placeholder={placeholder}
      onChange={onChange}
      wrap={wrap}
      {...extraProps}
    />
  );
};

MyTextArea.defaultProps = {
  className: '',
  name: '',
  value: '',
  placeholder: '',
  // https://www.w3schools.com/tags/att_textarea_wrap.asp
  wrap: 'hard',
  style: defaultStyle
};

MyTextArea.threeRowStyle = threeRowStyle;

export default MyTextArea;
