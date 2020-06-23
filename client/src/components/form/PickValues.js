import React, { useState, useMemo, useCallback, useEffect } from 'react';
import LabelAsyncSelectPair from 'components/form/LabelAsyncSelectPair';
import SortableList from './SortableList';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const PickValues = ({
  isHalf,
  name,
  labelMessage,
  selectOptions,
  onSelectInputChange,
  selectClassName,
  selectPlaceholder,
  selectIsLoading,
  pickedItemRender,
  pickedItems,
  getPickedItems
}) => {
  const [selectValue, setSelectValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(
    _ => {
      setSelectedOptions(getArraySafe(pickedItems));
    },
    [pickedItems, setSelectedOptions]
  );

  const selectedOptionValues = useMemo(
    _ => {
      return selectedOptions.map(option => option.value);
    },
    [selectedOptions]
  );

  // remove selectedOptions from selectOptions
  const options = useMemo(
    _ => {
      return getArraySafe(selectOptions).filter(
        option => !selectedOptionValues.includes(option.value)
      );
    },
    [selectOptions, selectedOptionValues]
  );

  /* event handlers */

  const handleGetPickedItems = useCallback(
    pickedItems => {
      getPickedItems(pickedItems);
    },
    [getPickedItems]
  );

  const handleNewItemList = useCallback(
    newItemList => {
      setSelectedOptions(newItemList);
      handleGetPickedItems(newItemList);
    },
    [setSelectedOptions, handleGetPickedItems]
  );

  const handleSelectChange = useCallback(
    option => {
      setSelectValue(null);
      const newSelectedOptions = [...selectedOptions, option];
      handleNewItemList(newSelectedOptions);
    },
    [selectedOptions, handleNewItemList, setSelectValue]
  );

  const handleSelectInputChange = useCallback(
    input => {
      setSelectValue(input);
      onSelectInputChange(input);
    },
    [setSelectValue, onSelectInputChange]
  );

  const handleSortableListDragEnd = useCallback(
    reorderedItems => {
      handleNewItemList(reorderedItems);
    },
    [handleNewItemList]
  );

  const handleSortableListItemRemoved = useCallback(
    newItemList => {
      handleNewItemList(newItemList);
    },
    [handleNewItemList]
  );

  /* end of event handlers */

  return (
    <>
      <LabelAsyncSelectPair
        name={name}
        value={selectValue}
        labelMessage={labelMessage}
        options={options}
        onChange={handleSelectChange}
        onInputChange={handleSelectInputChange}
        selectClassName={selectClassName}
        selectPlaceholder={selectPlaceholder}
        selectIsLoading={selectIsLoading}
        isHalf={isHalf}
      />
      <SortableList
        items={selectedOptions}
        itemRender={pickedItemRender}
        isShowRemoveButton={true}
        onDragEnd={handleSortableListDragEnd}
        onItemRemoved={handleSortableListItemRemoved}
      />
    </>
  );
};

PickValues.defaultProps = {
  pickedItems: [],
  getPickedItems: items => {
    console.log(items);
  }
};

export default PickValues;
