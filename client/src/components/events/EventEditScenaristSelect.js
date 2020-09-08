import React, { useMemo, useCallback /*, useEffect*/ } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
//import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';

/* constants */

const emptyScenaristForAdd = {
  name_tc: '',
  name_sc: '',
  name_en: ''
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

const Item = ({
  scenarist,
  isAddEventMode,
  handleItemRemoved,
  handleItemChange,
  index
}) => {
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

  const { name_tc, name_sc, name_en, draggableId } = scenarist;

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
                name='name_tc'
                value={name_tc}
                onChange={onChange}
                placeholder={
                  uiWordings['EventEdit.Scenarist.NameTcPlaceholder']
                }
                required={true}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='name_sc'
                value={name_sc}
                onChange={onChange}
                placeholder={
                  uiWordings['EventEdit.Scenarist.NameScPlaceholder']
                }
                required={/*true*/ !isAddEventMode}
              />
            </div>
            <div className='w3-col m4'>
              <InputText
                className='w3-margin-right'
                name='name_en'
                value={name_en}
                onChange={onChange}
                placeholder={
                  uiWordings['EventEdit.Scenarist.NameEnPlaceholder']
                }
                //required={true}
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
  { handleItemRemoved, handleItemChange, isAddEventMode, ...scenarist },
  index
) => {
  return (
    <Item
      key={index}
      scenarist={scenarist}
      isAddEventMode={isAddEventMode}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditScenaristSelect = ({
  scenarists,
  onGetScenarists,
  isAddEventMode
}) => {
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

  // // scenarists
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(scenarists)) {
  //       addScenarist();
  //     }
  //   },
  //   [scenarists, addScenarist]
  // );

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

  const customDataForItem = useMemo(
    _ => ({
      isAddEventMode
    }),
    [isAddEventMode]
  );

  return (
    <LabelSortableListPair
      name='scenarists'
      labelMessage={uiWordings['Event.ScenaristsLabel']}
      pickedItemRender={itemRender}
      customDataForItem={customDataForItem}
      getListStyle={getListStyle}
      pickedItems={scenaristsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

EventEditScenaristSelect.defaultProps = {
  isAddEventMode: false
};

export default EventEditScenaristSelect;
