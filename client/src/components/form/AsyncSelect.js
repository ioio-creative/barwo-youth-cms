import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

const optionsExample = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const filterOptionsExample = inputValue => {
  return optionsExample.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptionsExample = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterOptionsExample(inputValue));
  }, 1000);
};

// https://react-select.com/propss
// https://react-select.com/async#async
const MyAsyncSelect = ({
  className,
  name,
  value,
  loadOptions,
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
    <AsyncSelect
      className={className}
      name={name}
      value={value}
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      onInputChange={handleInputChange}
      placehold={placeholder}
    />
  );
};

MyAsyncSelect.defaultProps = {
  loadOptions: loadOptionsExample,
  onInputChange: input => {
    console.log(input);
  },
  placeholder: 'Select...'
};

export default MyAsyncSelect;
