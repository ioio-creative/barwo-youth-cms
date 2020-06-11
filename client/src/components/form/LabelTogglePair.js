import React from 'react';
import Label from './Label';
import Toggle from './Toggle';

const LabelTogglePair = ({ name, value, labelMessage, onChange, isHalf }) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <Toggle name={name} onChange={onChange} value={value} />
      </div>
    </div>
  );
};

LabelTogglePair.defaultProps = {
  isHalf: true
};

export default LabelTogglePair;
