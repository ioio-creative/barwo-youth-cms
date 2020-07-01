import React, { useMemo, useCallback, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';

/* constants */

const emptyScenaristForAdd = {
  scenarist_tc: '',
  scenarist_sc: '',
  scenarist_en: ''
};

const mapScenaristToListItem = scenarist => {
  return {
    ...scenarist,
    draggableId: scenarist.draggableId || scenarist._id || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 500
});

/* end of constants */

/* item */

const Item = ({ scenarist, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newScenarist => {
      handleItemChange(newScenarist, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newScenarist = {
        ...scenarist,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newScenarist);
    },
    [scenarist, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { scenarist_tc, scenarist_sc, scenarist_en, draggableId } = scenarist;

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
          <div className='w3-col m11 w3-row'>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_tc'
                value={scenarist_tc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.TcPlaceholder']}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_sc'
                value={scenarist_sc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.ScPlaceholder']}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='scenarist_en'
                value={scenarist_en}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Scenarist.EnPlaceholder']}
              />
            </div>
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
  { handleItemRemoved, handleItemChange, ...scenarist },
  index
) => {
  return (
    <Item
      key={index}
      scenarist={scenarist}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditScenaristSelect = ({ scenarists, onGetScenarists }) => {
  const scenaristsInPickedList = useMemo(
    _ => {
      return getArraySafe(scenarists).map(mapScenaristToListItem);
    },
    [scenarists]
  );

  /* methods */

  const dealWithGetScenarists = useCallback(
    newItemList => {
      onGetScenarists(newItemList);
    },
    [onGetScenarists]
  );

  const addScenarist = useCallback(
    _ => {
      dealWithGetScenarists([
        ...getArraySafe(scenarists),
        emptyScenaristForAdd
      ]);
    },
    [scenarists, dealWithGetScenarists]
  );

  /* end of methods */

  // scenarists
  useEffect(
    _ => {
      if (!isNonEmptyArray(scenarists)) {
        addScenarist();
      }
    },
    [scenarists, addScenarist]
  );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addScenarist();
    },
    [addScenarist]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetScenarists(newItemList);
    },
    [dealWithGetScenarists]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='scenarists'
      labelMessage={uiWordings['Event.ScenaristsLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={scenaristsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default EventEditScenaristSelect;
