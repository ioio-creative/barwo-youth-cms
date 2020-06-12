import React from 'react';
import Label from './Label';
import Select from './Select';

const LabelSelectPair = ({
  name,
  value,
  options,
  labelMessage,
  onChange,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <Select
          name={name}
          onChange={onChange}
          options={options}
          value={value}
        />
      </div>
    </div>
  );
};

LabelSelectPair.defaultProps = {
  isHalf: true
};

export default LabelSelectPair;
