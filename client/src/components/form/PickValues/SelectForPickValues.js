import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const filterOptions = inputValue => {
  return options.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterOptions(inputValue));
  }, 1000);
};

// https://react-select.com/async#async
const SelectForPickValues = ({ onInputChange }) => {
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
    <div>
      <pre>inputValue: "{inputValue}"</pre>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onInputChange={this.handleInputChange}
      />
    </div>
  );
};

export default SelectForPickValues;
