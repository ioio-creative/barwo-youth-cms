import React from 'react';
import LabelAsyncSelectPair from 'components/form/LabelAsyncSelectPair';
import SortableList from './SortableList';

const PickValues = ({
  isHalf,
  name,
  labelMessage,
  selectValue,
  selectLoadOptions,
  selectOnInputChange,
  selectClassName,
  selectPlaceholder,
  pickedItems,
  pickedItemRender,
  onPickedItemDragEnd
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
      <SortableList
        items={pickedItems}
        itemRender={pickedItemRender}
        onDragEnd={onPickedItemDragEnd}
      />
    </>
  );
};

export default PickValues;
