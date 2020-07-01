import React, { useCallback } from 'react';
//import { DatePicker } from '@buffetjs/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const nullDateValue = new Date('31 Dec 2099 12:00:00');
const isNullDate = dateObj => {
  if (!(dateObj instanceof Date)) {
    return true;
  }
  return dateObj.getFullYear() === nullDateValue.getFullYear();
};

/**
 * https://www.npmjs.com/package/react-datepicker
  Keyboard support
  Left: Move to the previous day.
  Right: Move to the next day.
  Up: Move to the previous week.
  Down: Move to the next week.
  PgUp: Move to the previous month.
  PgDn: Move to the next month.
  Home: Move to the previous year.
  End: Move to the next year.
  Enter/Esc/Tab: close the calendar. (Enter & Esc calls preventDefault)}
 */

const MyDatePicker = ({ name, value, onChange, dateFormat, placeholder }) => {
  const handleChange = useCallback(
    newValue => {
      onChange({
        target: {
          name: name,
          value: isNullDate(newValue) ? null : newValue
        }
      });
    },
    [name, onChange]
  );

  let cleanedValue;
  if ([undefined, null].includes(value)) {
    cleanedValue = nullDateValue;
  } else {
    cleanedValue = new Date(value);
  }

  return (
    <DatePicker
      name={name}
      selected={cleanedValue}
      onChange={handleChange}
      dateFormat={dateFormat}
      placeholderText={placeholder}
    />
  );
};

MyDatePicker.defaultProps = {
  name: 'date',
  onChange: ({ target }) => {
    console.log(target.value);
  },
  dateFormat: 'yyyy-MM-dd',
  placeholder: 'Click to select a date'
};

export default MyDatePicker;
