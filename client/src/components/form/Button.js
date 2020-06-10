import React from 'react';
import { Button } from '@buffetjs/core';

const MyButton = ({
  className,
  color,
  textColor,
  icon,
  children,
  onClick,
  disabled
}) => {
  const iconElement = icon ? <i className={icon} /> : null;
  return (
    <Button
      className={`w3-button w3-ripple w3-${color} w3-text-${textColor} w3-section ${className}`}
      icon={iconElement}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

MyButton.defaultProps = {
  className: '',
  color: 'blue',
  textColor: 'white',
  icon: null
};

export default MyButton;
