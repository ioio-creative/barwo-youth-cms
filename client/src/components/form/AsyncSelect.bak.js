import React, { useCallback, useRef, useEffect } from 'react';
import Select from 'react-select';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import './AsyncSelect.css';

const optionsExample = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

// https://react-select.com/styles
const customStyles = {
  option: (provided, state) => ({
    ...provided
  })
};

// https://react-select.com/propss
// https://react-select.com/async#async
const MyAsyncSelect = ({
  className,
  name,
  value,
  options,
  isLoading,
  onChange,
  onInputChange,
  placeholder
}) => {
  const selectRef = useRef(null);

  const handleInputChange = useCallback(
    newValue => {
      const newInputValue = newValue.replace(/\W/g, '');
      invokeIfIsFunction(onInputChange, newInputValue);
      return newInputValue;
    },
    [onInputChange]
  );

  /**
   * !!!Important!!!
   * binding to selectRef onInputChange permits input of Chinese characters
   * https://react-select.com/advanced#accessing-internals
   */
  useEffect(
    _ => {
      if (selectRef.current) {
        selectRef.current.onInputChange(input => {
          handleInputChange(input);
        });
      }
    },
    [handleInputChange]
  );

  return (
    <div className='async-select'>
      <Select
        ref={selectRef}
        styles={customStyles}
        className={className}
        name={name}
        value={value}
        options={options}
        isLoading={isLoading}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
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
