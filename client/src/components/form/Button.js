import React from 'react';
import { Button } from '@buffetjs/core';

const isHashColor = obj =>
  typeof obj === 'string' && obj.length > 0 && obj[0] === '#';

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
  let style = {};
  if (isHashColor(color)) {
    style.backgroundColor = color;
  }
  if (isHashColor(textColor)) {
    style.color = textColor;
  }
  return (
    <Button
      className={`w3-button w3-ripple w3-${color} w3-text-${textColor} w3-section ${className}`}
      style={style}
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
