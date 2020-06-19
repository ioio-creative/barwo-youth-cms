import React from 'react';
import LabelAsyncSelectPair from 'components/form/LabelAsyncSelectPair';

const PickValues = ({
  isHalf,
  name,
  labelMessage,
  selectValue,
  selectLoadOptions,
  selectOnInputChange,
  selectClassName,
  selectPlaceholder
}) => {
  return (
    <>
      <LabelAsyncSelectPair
        name={name}
        value={selectValue}
        labelMessage={labelMessage}
        loadOptions={selectLoadOptions}
        onInputChange={selectOnInputChange}
        selectClassName={selectClassName}
        selectPlaceholder={selectPlaceholder}
        isHalf={isHalf}
      />
    </>
  );
};

export default PickValues;
