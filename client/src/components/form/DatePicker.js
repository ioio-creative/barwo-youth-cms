import React, { useCallback } from 'react';
import { DatePicker } from '@buffetjs/core';
import { dateTimeLibrary } from 'utils/datetime';

/**
 * !!!Important!!!
 * have to use the moment library with the value supplied to DatePicker
 */

const MyDatePicker = ({ name, value, onChange }) => {
  const handleChange = useCallback(
    e => {
      //console.log(e.target.value);
      onChange({
        ...e,
        target: {
          ...e.target,
          // https://momentjs.com/docs/#/displaying/as-javascript-date/
          value: e.target.value.toDate()
        }
      });
    },
    [onChange]
  );
  return (
    <DatePicker
      name={name}
      value={dateTimeLibrary(value)}
      onChange={handleChange}
    />
  );
};

MyDatePicker.defaultProps = {
  name: 'date',
  value: new Date(),
  onChange: ({ target }) => {
    console.log(target.value);
  }
};

export default MyDatePicker;
