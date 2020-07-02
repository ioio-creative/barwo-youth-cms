import React, { useMemo, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';

/* globals */

let inputTextType = 'text';

/* end of globals */

/* constants */

const mapTextToListItem = text => {
  return {
    text: text,
    draggableId: guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 350
});

/* end of constants */

/* item */

const Item = ({ text, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newText => {
      handleItemChange(newText, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newText = e.target.value;
      dealWithItemChange(newText);
    },
    [dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

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
          <div className='w3-show-inline-block w3-margin-right'>
            <InputText
              name='text'
              value={text}
              type={inputTextType}
              onChange={onChange}
              required={true}
            />
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
  { handleItemRemoved, handleItemChange, ...text },
  index
) => {
  return (
    <Item
      key={index}
      text={text}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const TextList = ({
  name,
  labelMessage,
  inputType,
  texts,
  onGetTexts,
  emptyTextForAdd
}) => {
  const textsInPickedList = useMemo(
    _ => {
      return getArraySafe(texts).map(mapTextToListItem);
    },
    [texts]
  );

  // inputType
  useEffect(
    _ => {
      inputTextType = inputType;
    },
    [inputType]
  );

  /* methods */

  const dealWithGetTexts = useCallback(
    newItemList => {
      onGetTexts(newItemList);
    },
    [onGetTexts]
  );

  const addText = useCallback(
    _ => {
      dealWithGetTexts([...getArraySafe(texts), emptyTextForAdd]);
    },
    [texts, dealWithGetTexts]
  );

  /* end of methods */

  // texts
  useEffect(
    _ => {
      if (!isNonEmptyArray(texts)) {
        addText();
      }
    },
    [texts, addText]
  );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addText();
    },
    [addText]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetTexts(newItemList);
    },
    [dealWithGetTexts]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name={name}
      labelMessage={labelMessage}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={textsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

TextList.defaultProps = {
  name: 'texts',
  emptyTextForAdd: ''
};

export default TextList;
