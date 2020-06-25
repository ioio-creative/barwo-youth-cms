import React from 'react';
import { TimePicker } from '@buffetjs/core';

const MyTimePicker = ({ name, value, onChange, isUseSeconds }) => {
  return (
    <TimePicker
      name={name}
      onChange={onChange}
      seconds={isUseSeconds}
      value={value}
    />
  );
};

MyTimePicker.defaultProps = {
  name: 'time',
  value: '12:30',
  onChange: ({ target: { value } }) => {
    console.log(value);
    // const hour = moment(value, 'HH:mm:ss');
    // hour.toISOString();
    // hour.format();
    // setValue(value);
  },
  isUseSeconds: false
};

export default MyTimePicker;
