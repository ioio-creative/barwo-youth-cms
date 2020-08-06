import React, { useMemo, useCallback /*, useEffect*/ } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import TextArea from 'components/form/TextArea';
//import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';

/* constants */

const emptyTextItemForAdd = {
  text: ''
};

const mapTextToTextItem = text => {
  return {
    text
  };
};

const getTextFromTextItem = textItem => textItem.text;

const mapTextItemToListItem = textItem => {
  return {
    ...textItem,
    draggableId: textItem.draggableId || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

/* end of constants */

/* item */

const Item = ({
  textItem,
  handleItemRemoved,
  handleItemChange,
  inputType,
  isUseTextArea,
  index
}) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newTextItem => {
      handleItemChange(newTextItem, index);
    },
    [handleItemChange, index]
  );

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newTextItem = {
        ...textItem,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newTextItem);
    },
    [textItem, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { text, draggableId } = textItem;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          className='w3-row'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className='w3-col m11'>
            {isUseTextArea ? (
              <TextArea
                name='text'
                value={text}
                onChange={onChange}
                placeholder=''
                required={true}
              />
            ) : (
              <InputText
                name='text'
                value={text}
                type={inputType}
                onChange={onChange}
                required={true}
              />
            )}
          </div>
          <div className='w3-right'>
            {isFunction(handleItemRemoved) ? (
              <LabelSortableListPair.ItemRemoveButton
                onClick={onRemoveButtonClick}
              />
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const itemRender = (
  {
    handleItemRemoved,
    handleItemChange,
    inputType,
    isUseTextArea,
    ...textItem
  },
  index
) => {
  return (
    <Item
      key={index}
      textItem={textItem}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      inputType={inputType}
      isUseTextArea={isUseTextArea}
      index={index}
    />
  );
};

const itemRenderFactory = (inputType, isUseTextArea) => {
  return (itemObj, index) =>
    itemRender({ ...itemObj, inputType, isUseTextArea }, index);
};

/* end of item */

const TextList = ({
  name,
  labelMessage,
  listWidth,
  textItems,
  onGetTextItems,
  inputType,
  isUseTextArea
}) => {
  const textItemsInPickedList = useMemo(
    _ => {
      return getArraySafe(textItems).map(mapTextItemToListItem);
    },
    [textItems]
  );

  /* methods */

  const dealWithGetTextItems = useCallback(
    newItemList => {
      onGetTextItems(newItemList);
    },
    [onGetTextItems]
  );

  const addTextItem = useCallback(
    _ => {
      dealWithGetTextItems([
        ...getArraySafe(textItemsInPickedList),
        emptyTextItemForAdd
      ]);
    },
    [textItemsInPickedList, dealWithGetTextItems]
  );

  /* end of methods */

  // // textItems
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(textItems)) {
  //       addTextItem();
  //     }
  //   },
  //   [textItems, addTextItem]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addTextItem();
    },
    [addTextItem]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetTextItems(newItemList);
    },
    [dealWithGetTextItems]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name={name}
      labelMessage={labelMessage}
      listWidth={listWidth}
      pickedItemRender={itemRenderFactory(inputType, isUseTextArea)}
      pickedItems={textItemsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

TextList.defaultProps = {
  name: 'texts',
  listWidth: 350
};

TextList.mapTextToTextItem = mapTextToTextItem;
TextList.getTextFromTextItem = getTextFromTextItem;

export default TextList;
