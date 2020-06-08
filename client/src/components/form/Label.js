import React from 'react';
import { Label } from '@buffetjs/core';

const MyLabel = ({ htmlFor, message }) => {
  return <Label htmlFor={htmlFor} message={message} />;
};

export default MyLabel;
