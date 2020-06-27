import React from 'react';
import Label from './Label';
import TimePicker from './DatePicker';

const LabelTimePickerPair = ({
  name,
  value,
  labelMessage,
  isUseSeconds,
  onChange,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <TimePicker
          name={name}
          value={value}
          isUseSeconds={isUseSeconds}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

LabelTimePickerPair.defaultProps = {
  isHalf: true
};

export default LabelTimePickerPair;
