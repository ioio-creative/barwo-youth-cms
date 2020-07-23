import React, { useState, useMemo, useCallback, useEffect } from 'react';
import LabelAsyncSelectPair from 'components/form/LabelAsyncSelectPair';
import SortableList from './SortableList';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const PickValues = ({
  isHalf,
  name,
  labelMessage,
  isUseSelect,
  selectOptions,
  selectClassName,
  selectPlaceholder,
  selectIsLoading,
  listWidth,
  pickedItemRender,
  pickedItems,
  getPickedItems
}) => {
  const [selectValue, setSelectValue] = useState('');
  // note selectedOptions is different from selectOptions
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

  /* methods */

  const dealWithNewPickedItems = useCallback(
    newPickedItems => {
      getPickedItems(newPickedItems);
    },
    [getPickedItems]
  );

  /* end of methods */

  /* event handlers */

  const handleSelectChange = useCallback(
    option => {
      setSelectValue(null);
      const newSelectedOptions = [...selectedOptions, option];
      dealWithNewPickedItems(newSelectedOptions);
    },
    [selectedOptions, dealWithNewPickedItems, setSelectValue]
  );

  const handleSortableListDragEnd = useCallback(
    reorderedItems => {
      dealWithNewPickedItems(reorderedItems);
    },
    [dealWithNewPickedItems]
  );

  const handleSortableListItemRemoved = useCallback(
    newItemList => {
      dealWithNewPickedItems(newItemList);
    },
    [dealWithNewPickedItems]
  );

  /* end of event handlers */

  return (
    <>
      {isUseSelect && (
        <LabelAsyncSelectPair
          name={name}
          value={selectValue}
          labelMessage={labelMessage}
          options={options}
          onChange={handleSelectChange}
          selectClassName={selectClassName}
          selectPlaceholder={selectPlaceholder}
          selectIsLoading={selectIsLoading}
          isHalf={isHalf}
        />
      )}
      <SortableList
        items={selectedOptions}
        listWidth={listWidth}
        itemRender={pickedItemRender}
        isShowRemoveButton={true}
        onDragEnd={handleSortableListDragEnd}
        onItemRemoved={handleSortableListItemRemoved}
      />
    </>
  );
};

PickValues.defaultProps = {
  isUseSelect: true,
  pickedItems: [],
  getPickedItems: items => {
    console.log(items);
  }
};

export default PickValues;
