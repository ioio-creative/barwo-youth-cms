import React, { useCallback, useMemo } from 'react';
import Label from 'components/form/Label';
import Button from 'components/form/Button';
import SortableList from './SortableList';
import isFunction from 'utils/js/function/isFunction';

const LabelSortableListPair = ({
  isHalf,
  isUseRemove,
  isUseToFirst,
  isUseToLast,
  isShowAddButton,
  addButtonRender,
  listWidth,
  name,
  labelMessage,
  pickedItemRender,
  customDataForItem,
  getListStyle,
  pickedItems,
  getPickedItems,
  onAddButtonClick,
  orderDirection
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

  const handleSortableListItemChange = useCallback(
    newItemList => {
      handleGetPickedItems(newItemList);
    },
    [handleGetPickedItems]
  );

  const handleSortableListItemRemoved = useMemo(
    _ => {
      return isUseRemove
        ? newItemList => {
            handleGetPickedItems(newItemList);
          }
        : null;
    },
    [isUseRemove, handleGetPickedItems]
  );

  const handleSortableListItemToFirst = useMemo(
    _ => {
      return isUseToFirst
        ? newItemList => {
            handleGetPickedItems(newItemList);
          }
        : null;
    },
    [isUseToFirst, handleGetPickedItems]
  );

  const handleSortableListItemToLast = useMemo(
    _ => {
      return isUseToLast
        ? newItemList => {
            handleGetPickedItems(newItemList);
          }
        : null;
    },
    [isUseToLast, handleGetPickedItems]
  );

  /* end of event handlers */

  return (
    <div className='w3-row w3-section'>
      <div className={`${isHalf ? 'w3-half' : ''}`}>
        <Label htmlFor={name} message={labelMessage} />
        {isShowAddButton && (
          <>
            {isFunction(addButtonRender) ? (
              addButtonRender()
            ) : (
              <Button className='w3-margin-left' onClick={onAddButtonClick}>
                <i className='fa fa-plus' />
              </Button>
            )}
          </>
        )}
        <SortableList
          items={pickedItems}
          listWidth={listWidth}
          itemRender={pickedItemRender}
          customDataForItem={customDataForItem}
          getListStyle={getListStyle}
          onDragEnd={handleSortableListDragEnd}
          onItemRemoved={handleSortableListItemRemoved}
          onItemChange={handleSortableListItemChange}
          onItemToFirst={handleSortableListItemToFirst}
          onItemToLast={handleSortableListItemToLast}
          orderDirection={orderDirection}
        />
      </div>
    </div>
  );
};

LabelSortableListPair.defaultProps = {
  isHalf: true,
  isShowAddButton: true,
  isUseRemove: true,
  isUseToFirst: false,
  isUseToLast: false,
  pickedItems: [],
  getPickedItems: items => {
    console.log(items);
  },
  onAddButtonClick: _ => {
    console.log('LabelSortableListPair add button clicked.');
  }
};

LabelSortableListPair.getListStyleDefault = SortableList.getListStyleDefault;
LabelSortableListPair.getItemStyleDefault = SortableList.getItemStyleDefault;
LabelSortableListPair.ItemRemoveButton = SortableList.ItemRemoveButton;
LabelSortableListPair.ItemToFirstButton = SortableList.ItemToFirstButton;
LabelSortableListPair.ItemToLastButton = SortableList.ItemToLastButton;

export default LabelSortableListPair;
