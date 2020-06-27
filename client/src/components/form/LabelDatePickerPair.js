import React from 'react';
import Label from './Label';
import DatePicker from './DatePicker';

const LabelDatePickerPair = ({
  name,
  value,
  labelMessage,
  onChange,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <DatePicker name={name} value={value} onChange={onChange} />
      </div>
    </div>
  );
};

LabelDatePickerPair.defaultProps = {
  isHalf: true
};

export default LabelDatePickerPair;
