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

const emptyPhoneForAdd = {
  label_tc: '',
  label_sc: '',
  label_en: '',
  phone: ''
};

const mapPhoneToListItem = phone => {
  return {
    ...phone,
    draggableId: phone.draggableId || phone._id || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

const getListStyle = isDraggingOver => ({
  ...LabelSortableListPair.getListStyleDefault(isDraggingOver),
  width: 650
});

/* end of constants */

/* item */

const Item = ({ phone, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newPhone => {
      handleItemChange(newPhone, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newPhone = {
        ...phone,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newPhone);
    },
    [phone, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { label_tc, label_sc, label_en, phone: phoneNum, draggableId } = phone;

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
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='label_tc'
                value={label_tc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Phone.LabelTcPlaceholder']}
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='label_sc'
                value={label_sc}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Phone.LabelScPlaceholder']}
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='label_en'
                value={label_en}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Phone.LabelEnPlaceholder']}
                required={true}
              />
            </div>
            <div className='w3-col m3'>
              <InputText
                className='w3-margin-right'
                name='phone'
                value={phoneNum}
                onChange={onChange}
                placeholder={uiWordings['EventEdit.Phone.PhonePlaceholder']}
                required={true}
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
  { handleItemRemoved, handleItemChange, ...phone },
  index
) => {
  return (
    <Item
      key={index}
      phone={phone}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditPhoneSelect = ({ phones, onGetPhones }) => {
  const phonesInPickedList = useMemo(
    _ => {
      return getArraySafe(phones).map(mapPhoneToListItem);
    },
    [phones]
  );

  /* methods */

  const dealWithGetPhones = useCallback(
    newItemList => {
      onGetPhones(newItemList);
    },
    [onGetPhones]
  );

  const addPhone = useCallback(
    _ => {
      dealWithGetPhones([...getArraySafe(phones), emptyPhoneForAdd]);
    },
    [phones, dealWithGetPhones]
  );

  /* end of methods */

  // // phones
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(phones)) {
  //       addPhone();
  //     }
  //   },
  //   [phones, addPhone]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addPhone();
    },
    [addPhone]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetPhones(newItemList);
    },
    [dealWithGetPhones]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='phones'
      labelMessage={uiWordings['Event.PhonesLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={phonesInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default EventEditPhoneSelect;
