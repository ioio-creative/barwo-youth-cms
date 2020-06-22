import React, { useState, useMemo, useCallback } from 'react';
import LabelAsyncSelectPair from 'components/form/LabelAsyncSelectPair';
import SortableList from './SortableList';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';

const PickValues = ({
  isHalf,
  name,
  labelMessage,
  selectOptions,
  onSelectInputChange,
  selectClassName,
  selectPlaceholder,
  pickedItemRender,
  getPickedItems
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const selectedOptionIds = useMemo(
    _ => {
      return selectedOptions.map(option => option._id);
    },
    [selectedOptions]
  );

  // remove selectedOptions from selectOptions
  const options = isNonEmptyArray(selectOptions)
    ? selectOptions.filter(option => !selectedOptionIds.includes(option._id))
    : [selectOptions, selectedOptionIds];

  /* event handlers */

  const onGetPickedItems = useCallback(
    pickedItems => {
      invokeIfIsFunction(getPickedItems, pickedItems);
    },
    [getPickedItems]
  );

  const onSelectChange = useCallback(
    option => {
      //setSelectedOption(option);
      const newSelectedOptions = [
        ...selectedOptions,
        new SortableList.Item(option.value, option.label)
      ];
      setSelectedOptions(newSelectedOptions);
      onGetPickedItems(newSelectedOptions);
    },
    [selectedOptions, setSelectedOptions, onGetPickedItems]
  );

  const onSortableListDragEnd = useCallback(
    reorderedItems => {
      setSelectedOptions(reorderedItems);
      onGetPickedItems(reorderedItems);
    },
    [setSelectedOptions, onGetPickedItems]
  );

  /* end of event handlers */

  return (
    <>
      <LabelAsyncSelectPair
        name={name}
        value={selectedOption}
        labelMessage={labelMessage}
        options={options}
        onChange={onSelectChange}
        onInputChange={onSelectInputChange}
        selectClassName={selectClassName}
        selectPlaceholder={selectPlaceholder}
        isHalf={isHalf}
      />
      <SortableList
        items={selectedOptions}
        itemRender={pickedItemRender}
        onDragEnd={onSortableListDragEnd}
      />
    </>
  );
};

export default PickValues;
