import React from 'react';
import Label from './Label';
import Select from './Select';

const LabelSelectPair = ({ name, value, options, labelMessage, onChange }) => {
  return (
    <div className='w3-row'>
      <div className='w3-half'>
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

export default LabelSelectPair;
