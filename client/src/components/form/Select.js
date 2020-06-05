import React from 'react';

const Option = ({ name, value, checked, label, onChange }) => {
  return (
    <>
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {` ${label} `}
    </>
  );
};

const Select = ({ name, value, options, label, onChange }) => {
  return (
    <>
      <h5>{label}</h5>
      {options.map(option => {
        return (
          <Option
            key={option.value}
            name={name}
            value={option.value}
            checked={option.value === value}
            label={option.label}
            onChange={onChange}
          />
        );
      })}
    </>
  );
};

export default Select;
