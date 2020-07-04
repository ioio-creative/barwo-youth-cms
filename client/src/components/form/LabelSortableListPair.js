import React, { useCallback } from 'react';
import Label from 'components/form/Label';
import Button from 'components/form/Button';
import SortableList from './SortableList';

const LabelSortableListPair = ({
  isHalf,
  isShowAddButton,
  name,
  labelMessage,
  pickedItemRender,
  getListStyle,
  pickedItems,
  getPickedItems,
  onAddButtonClick
}) => {
  /* event handlers */

  const handleGetPickedItems = useCallback(
    pickedItems => {
      getPickedItems(pickedItems);
    },
    [getPickedItems]
  );

  const handleSortableListDragEnd = useCallback(
    reorderedItems => {
      handleGetPickedItems(reorderedItems);
    },
    [handleGetPickedItems]
  );

  const handleSortableListItemRemoved = useCallback(
    newItemList => {
      handleGetPickedItems(newItemList);
    },
    [handleGetPickedItems]
  );

  const handleSortableListItemChange = useCallback(
    newItemList => {
      handleGetPickedItems(newItemList);
    },
    [handleGetPickedItems]
  );

  /* end of event handlers */

  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        {isShowAddButton && (
          <Button className='w3-margin-left' onClick={onAddButtonClick}>
            <i className='fa fa-plus' />
          </Button>
        )}
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
  isShowAddButton: true,
  pickedItems: [],
  getPickedItems: items => {
    console.log(items);
  },
  onAddButtonClicked: _ => {
    console.log('LabelSortableListPair add button clicked.');
  }
};

LabelSortableListPair.getListStyleDefault = SortableList.getListStyleDefault;
LabelSortableListPair.getItemStyleDefault = SortableList.getItemStyleDefault;
LabelSortableListPair.ItemRemoveButton = SortableList.ItemRemoveButton;

export default LabelSortableListPair;
