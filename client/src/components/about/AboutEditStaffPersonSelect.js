import React, { useMemo, useCallback /*, useEffect*/ } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import InputText from 'components/form/InputText';
import TextArea from 'components/form/TextArea';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
//import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import guid from 'utils/guid';

/* constants */

const emptyStaffPersonForAdd = {
  title_tc: '',
  name_tc: '',
  title_sc: '',
  name_sc: '',
  title_en: '',
  name_en: ''
};

const mapStaffPersonToListItem = staffPerson => {
  return {
    ...staffPerson,
    draggableId: staffPerson.draggableId || staffPerson._id || guid()
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...LabelSortableListPair.getItemStyleDefault(isDragging, draggableStyle)
});

/* end of constants */

/* item */

const Item = ({ staffPerson, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newStaffPerson => {
      handleItemChange(newStaffPerson, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newStaffPerson = {
        ...staffPerson,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newStaffPerson);
    },
    [staffPerson, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const {
    title_tc,
    name_tc,
    title_sc,
    name_sc,
    title_en,
    name_en,
    draggableId,

    isUseTextAreaForName
  } = staffPerson;

  const ComponentForName = isUseTextAreaForName ? TextArea : InputText;

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
            <div className='w3-row w3-margin-bottom'>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='title_tc'
                  value={title_tc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.TitleTcPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <ComponentForName
                  className='w3-margin-right'
                  name='name_tc'
                  value={name_tc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.NameTcPlaceholder']
                  }
                  required={true}
                />
              </div>
            </div>
            <div className='w3-row w3-margin-bottom'>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='title_sc'
                  value={title_sc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.TitleScPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <ComponentForName
                  className='w3-margin-right'
                  name='name_sc'
                  value={name_sc}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.NameScPlaceholder']
                  }
                  required={true}
                />
              </div>
            </div>
            <div className='w3-row'>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='title_en'
                  value={title_en}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.TitleEnPlaceholder']
                  }
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <ComponentForName
                  className='w3-margin-right'
                  name='name_en'
                  value={name_en}
                  onChange={onChange}
                  placeholder={
                    uiWordings['AboutEdit.StaffPerson.NameEnPlaceholder']
                  }
                  required={true}
                />
              </div>
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
  { handleItemRemoved, handleItemChange, ...staffPerson },
  index
) => {
  return (
    <Item
      key={index}
      staffPerson={staffPerson}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

const itemRenderFactory = isUseTextAreaForName => {
  return (itemObj, index) =>
    itemRender({ ...itemObj, isUseTextAreaForName }, index);
};

/* end of item */

const AboutEditStaffPersonSelect = ({
  staffPersons,
  onGetStaffPersons,
  labelMessage,
  listWidth,
  isUseTextAreaForName
}) => {
  const staffPersonsInPickedList = useMemo(
    _ => {
      return getArraySafe(staffPersons).map(mapStaffPersonToListItem);
    },
    [staffPersons]
  );

  /* methods */

  const dealWithGetStaffPersons = useCallback(
    newItemList => {
      onGetStaffPersons(newItemList);
    },
    [onGetStaffPersons]
  );

  const addStaffPerson = useCallback(
    _ => {
      dealWithGetStaffPersons([
        ...getArraySafe(staffPersons),
        emptyStaffPersonForAdd
      ]);
    },
    [staffPersons, dealWithGetStaffPersons]
  );

  /* end of methods */

  // // staff persons
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(staffPersons)) {
  //       addStaffPerson();
  //     }
  //   },
  //   [staffPersons, addStaffPerson]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addStaffPerson();
    },
    [addStaffPerson]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetStaffPersons(newItemList);
    },
    [dealWithGetStaffPersons]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='staffPersons'
      labelMessage={labelMessage}
      listWidth={listWidth}
      pickedItemRender={itemRenderFactory(isUseTextAreaForName)}
      pickedItems={staffPersonsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

AboutEditStaffPersonSelect.defaultProps = {
  listWidth: 650,
  isUseTextAreaForName: false
};

export default AboutEditStaffPersonSelect;
