import React from 'react';

const SubmitButton = ({ className, color, textColor, label }) => {
  return (
    <input
      className={`w3-button w3-ripple w3-${color} w3-text-${textColor} w3-margin ${className}`}
      type='submit'
      value={label}
    />
  );
};

SubmitButton.defaultProps = {
  className: '',
  color: 'blue',
  textColor: 'white'
};

export default SubmitButton;
