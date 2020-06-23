import React, { useState, useCallback, useEffect } from 'react';
import Label from 'components/form/Label';
import Button from 'components/form/Button';
import SortableList from './SortableList';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const LabelSortableListPair = ({
  isHalf,
  name,
  labelMessage,
  pickedItemRender,
  getListStyle,
  controlledPickedItems,
  getPickedItems,
  onAddButtonClick
}) => {
  const [pickedItems, setPickedItems] = useState([]);

  useEffect(
    _ => {
      setPickedItems(getArraySafe(controlledPickedItems));
    },
    [controlledPickedItems, setPickedItems]
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
      setPickedItems(newItemList);
      handleGetPickedItems(newItemList);
    },
    [setPickedItems, handleGetPickedItems]
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

  const handleSortableListItemChange = useCallback(
    newItemList => {
      handleNewItemList(newItemList);
    },
    [handleNewItemList]
  );

  /* end of event handlers */

  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        <Button className='w3-margin-left' onClick={onAddButtonClick}>
          <i className='fa fa-plus' />
        </Button>
        <SortableList
          items={pickedItems}
          itemRender={pickedItemRender}
          isShowRemoveButton={true}
          getListStyle={getListStyle}
          onDragEnd={handleSortableListDragEnd}
          onItemRemoved={handleSortableListItemRemoved}
          onItemChange={handleSortableListItemChange}
        />
      </div>
    </div>
  );
};

LabelSortableListPair.defaultProps = {
  isHalf: true,
  controlledPickedItems: [],
  getPickedItems: items => {
    console.log(items);
  },
  onAddButtonClicked: _ => {
    console.log('LabelSortableListPair add button clicked.');
  }
};

export default LabelSortableListPair;
