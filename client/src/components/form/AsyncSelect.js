import React from 'react';
import Select from 'react-select';
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
  placeholder
}) => {
  return (
    <div className='async-select'>
      <Select
        styles={customStyles}
        className={className}
        name={name}
        value={value}
        options={options}
        isLoading={isLoading}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

MyAsyncSelect.defaultProps = {
  options: optionsExample,
  onChange: selectedOption => {
    console.log(selectedOption);
  },
  placeholder: 'Select...'
};

export default MyAsyncSelect;
