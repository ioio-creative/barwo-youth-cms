import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

const optionsExample = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

// https://react-select.com/styles
const customStyles = {
  option: (provided, state) => ({
    ...provided
    //backgroundColor: 'white'
  })
};

// https://react-select.com/propss
// https://react-select.com/async#async
const MyAsyncSelect = ({
  className,
  name,
  value,
  options,
  onChange,
  onInputChange,
  placeholder
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = useCallback(
    newValue => {
      const newInputValue = newValue.replace(/\W/g, '');
      setInputValue(newInputValue);
      invokeIfIsFunction(onInputChange, newInputValue);
      return newInputValue;
    },
    [setInputValue, onInputChange]
  );

  return (
    <Select
      styles={customStyles}
      className={className}
      name={name}
      value={value}
      options={options}
      isLoading={!isNonEmptyArray(options)}
      onChange={onChange}
      onInputChange={handleInputChange}
      placeholder={placeholder}
    />
  );
};

MyAsyncSelect.defaultProps = {
  options: optionsExample,
  onInputChange: input => {
    console.log(input);
  },
  onChange: selectedOption => {
    console.log(selectedOption);
  },
  placeholder: 'Select...'
};

export default MyAsyncSelect;
