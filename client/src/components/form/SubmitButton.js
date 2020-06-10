import React from 'react';

const SubmitButton = ({ className, color, textColor, label, disabled }) => {
  const extraProps = {};
  if (disabled === true) {
    extraProps.disabled = true;
  }
  return (
    <input
      className={`w3-button w3-ripple w3-${color} w3-text-${textColor} w3-margin ${className}`}
      type='submit'
      value={label}
      {...extraProps}
    />
  );
};

SubmitButton.defaultProps = {
  className: '',
  color: 'blue',
  textColor: 'white'
};

export default SubmitButton;
