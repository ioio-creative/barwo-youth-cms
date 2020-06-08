import React from 'react';
import { Button } from '@buffetjs/core';

const MyButton = ({ color, icon, label, onClick }) => {
  const iconElement = icon ? <i className={icon} /> : null;
  return (
    <Button color={color} icon={iconElement} label={label} onClick={onClick} />
  );
};

MyButton.defaultProps = {
  color: 'primary',
  icon: null
};

export default MyButton;
