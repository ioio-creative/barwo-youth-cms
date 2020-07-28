import React, { useCallback, useMemo } from 'react';
import Label from 'components/form/Label';
import Button from 'components/form/Button';
import SortableList from './SortableList';
import ModalFileManager from './ModalFileManager';

const LabelSortableListPair = ({
  isHalf,
  isShowAddButton,
  isUseRemove,
  isUseToFirst,
  isUseToLast,
  listWidth,
  name,
  labelMessage,
  pickedItemRender,
  getListStyle,
  pickedItems,
  getPickedItems,
  isMultiple,
  onAddButtonClick,
  mediaType
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
        {isShowAddButton && (<>
          {/* <Button className='w3-margin-left' onClick={onAddButtonClick}>
            <i className='fa fa-plus' />
          </Button> */}
          <ModalFileManager
            className='w3-margin-left'
            title={`File Manager${isMultiple ? ' (Multiple)' : ''}`}
            contentLabel={<i className='fa fa-plus' />}
            mediaTypeParam={mediaType}
            multiple={isMultiple}
            onSelect={handleGetPickedItems}
          />
        </>)}
        <SortableList
          items={pickedItems}
          listWidth={listWidth}
          itemRender={pickedItemRender}
          isShowRemoveButton={true}
          getListStyle={getListStyle}
          onDragEnd={handleSortableListDragEnd}
          onItemRemoved={handleSortableListItemRemoved}
          onItemChange={handleSortableListItemChange}
          onItemToFirst={handleSortableListItemToFirst}
          onItemToLast={handleSortableListItemToLast}
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
  onAddButtonClicked: _ => {
    console.log('LabelSortableListPair add button clicked.');
  }
};

LabelSortableListPair.getListStyleDefault = SortableList.getListStyleDefault;
LabelSortableListPair.getItemStyleDefault = SortableList.getItemStyleDefault;
LabelSortableListPair.ItemRemoveButton = SortableList.ItemRemoveButton;
LabelSortableListPair.ItemToFirstButton = SortableList.ItemToFirstButton;
LabelSortableListPair.ItemToLastButton = SortableList.ItemToLastButton;

export default LabelSortableListPair;
