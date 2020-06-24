import React from 'react';
import Label from './Label';
import AsyncSelect from './AsyncSelect';

const LabelAsyncSelectPair = ({
  name,
  value,
  labelMessage,
  options,
  onChange,
  selectClassName,
  selectPlaceholder,
  selectIsLoading,
  isHalf
}) => {
  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <AsyncSelect
          className={selectClassName}
          name={name}
          value={value}
          options={options}
          isLoading={selectIsLoading}
          onChange={onChange}
          placeholder={selectPlaceholder}
        />
      </div>
    </div>
  );
};

LabelAsyncSelectPair.defaultProps = {
  isHalf: true
};

export default LabelAsyncSelectPair;
