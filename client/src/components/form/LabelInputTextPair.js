import React from 'react';
import Label from './Label';
import InputText from './InputText';

const LabelInputTextPair = ({
  name,
  value,
  inputType,
  labelMessage,
  placeholder,
  onChange,
  required,
  minLength
}) => {
  return (
    <div className='w3-section'>
      <Label htmlFor={name} message={labelMessage} />
      <InputText
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={inputType}
        value={value}
        required={required}
        minLength={minLength}
      />
    </div>
  );
};

export default LabelInputTextPair;
