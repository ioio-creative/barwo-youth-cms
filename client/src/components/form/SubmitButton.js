import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const SubmitButton = ({ color, textColor, label }) => {
  return (
    <input
      className={`w3-button w3-ripple w3-${color} w3-text-${textColor} w3-margin-bottom`}
      type='submit'
      value={label}
    />
  );
};

SubmitButton.defaultProps = {
  color: 'blue',
  textColor: 'white'
};

export default SubmitButton;
