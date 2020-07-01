import React from 'react';
import Label from './Label';
import DatePicker from './DatePicker';

const LabelDatePickerPair = ({
  name,
  value,
  labelMessage,
  onChange,
  dateFormat,
  placeholder,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <div>
          <Label htmlFor={name} message={labelMessage} />
        </div>
        <div>
          <DatePicker
            name={name}
            value={value}
            onChange={onChange}
            dateFormat={dateFormat}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

LabelDatePickerPair.defaultProps = {
  isHalf: true
};

export default LabelDatePickerPair;
