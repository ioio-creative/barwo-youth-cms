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

const emptyScriptMasterForAdd = {
  name_tc: '',
  name_sc: '',
  name_en: ''
};

const mapScriptMasterToListItem = scriptMaster => {
  return {
    ...scriptMaster,
    draggableId: scriptMaster.draggableId || scriptMaster._id || guid()
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
  scriptMaster,
  isAddEventMode,
  handleItemRemoved,
  handleItemChange,
  index
}) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newScriptMaster => {
      handleItemChange(newScriptMaster, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newScriptMaster = {
        ...scriptMaster,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newScriptMaster);
    },
    [scriptMaster, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { name_tc, name_sc, name_en, draggableId } = scriptMaster;

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
                  uiWordings['EventEdit.ScriptMaster.NameTcPlaceholder']
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
                  uiWordings['EventEdit.ScriptMaster.NameScPlaceholder']
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
                  uiWordings['EventEdit.ScriptMaster.NameEnPlaceholder']
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
  { handleItemRemoved, handleItemChange, isAddEventMode, ...scriptMaster },
  index
) => {
  return (
    <Item
      key={index}
      scriptMaster={scriptMaster}
      isAddEventMode={isAddEventMode}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditScriptMasterSelect = ({
  scriptMasters,
  onGetScriptMasters,
  isAddEventMode
}) => {
  const scriptMastersInPickedList = useMemo(
    _ => {
      return getArraySafe(scriptMasters).map(mapScriptMasterToListItem);
    },
    [scriptMasters]
  );

  /* methods */

  const dealWithGetScriptMasters = useCallback(
    newItemList => {
      onGetScriptMasters(newItemList);
    },
    [onGetScriptMasters]
  );

  const addScriptMaster = useCallback(
    _ => {
      dealWithGetScriptMasters([
        ...getArraySafe(scriptMasters),
        emptyScriptMasterForAdd
      ]);
    },
    [scriptMasters, dealWithGetScriptMasters]
  );

  /* end of methods */

  // // scriptMasters
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(scriptMasters)) {
  //       addScriptMasters();
  //     }
  //   },
  //   [scriptMasters, addScriptMaster]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addScriptMaster();
    },
    [addScriptMaster]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetScriptMasters(newItemList);
    },
    [dealWithGetScriptMasters]
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
      name='scriptMasters'
      labelMessage={uiWordings['Event.ScriptMastersLabel']}
      pickedItemRender={itemRender}
      customDataForItem={customDataForItem}
      getListStyle={getListStyle}
      pickedItems={scriptMastersInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

EventEditScriptMasterSelect.defaultProps = {
  isAddEventMode: false
};

export default EventEditScriptMasterSelect;
