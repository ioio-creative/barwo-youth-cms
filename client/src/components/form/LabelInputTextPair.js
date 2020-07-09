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
  minLength,
  disabled,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />{' '}
        {required === true ? '*' : ''}
        <InputText
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={inputType}
          value={value}
          required={required}
          minLength={minLength}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

LabelInputTextPair.defaultProps = {
  isHalf: true
};

export default LabelInputTextPair;
