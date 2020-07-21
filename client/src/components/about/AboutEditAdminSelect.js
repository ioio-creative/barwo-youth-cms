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

const emptyAdminForAdd = {
  title_tc: '',
  name_tc: '',
  title_sc: '',
  name_sc: '',
  title_en: '',
  name_en: ''
};

const mapAdminToListItem = admin => {
  return {
    ...admin,
    draggableId: admin.draggableId || admin._id || guid()
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

const Item = ({ admin, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newAdmin => {
      handleItemChange(newAdmin, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newAdmin = {
        ...admin,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newAdmin);
    },
    [admin, dealWithItemChange]
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
    draggableId
  } = admin;

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
                  placeholder={uiWordings['AboutEdit.Admin.TitleTcPlaceholder']}
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='name_tc'
                  value={name_tc}
                  onChange={onChange}
                  placeholder={uiWordings['AboutEdit.Admin.NameTcPlaceholder']}
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
                  placeholder={uiWordings['AboutEdit.Admin.TitleScPlaceholder']}
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='name_sc'
                  value={name_sc}
                  onChange={onChange}
                  placeholder={uiWordings['AboutEdit.Admin.NameScPlaceholder']}
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
                  placeholder={uiWordings['AboutEdit.Admin.TitleEnPlaceholder']}
                  required={true}
                />
              </div>
              <div className='w3-col m6'>
                <InputText
                  className='w3-margin-right'
                  name='name_en'
                  value={name_en}
                  onChange={onChange}
                  placeholder={uiWordings['AboutEdit.Admin.NameEnPlaceholder']}
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
  { handleItemRemoved, handleItemChange, ...admin },
  index
) => {
  return (
    <Item
      key={index}
      admin={admin}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const AboutEditAdminSelect = ({ admins, onGetAdmins }) => {
  const adminsInPickedList = useMemo(
    _ => {
      return getArraySafe(admins).map(mapAdminToListItem);
    },
    [admins]
  );

  /* methods */

  const dealWithGetAdmins = useCallback(
    newItemList => {
      onGetAdmins(newItemList);
    },
    [onGetAdmins]
  );

  const addAdmin = useCallback(
    _ => {
      dealWithGetAdmins([...getArraySafe(admins), emptyAdminForAdd]);
    },
    [admins, dealWithGetAdmins]
  );

  /* end of methods */

  // // admins
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(admins)) {
  //       addAdmin();
  //     }
  //   },
  //   [admins, addAdmin]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addAdmin();
    },
    [addAdmin]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetAdmins(newItemList);
    },
    [dealWithGetAdmins]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='admins'
      labelMessage={uiWordings['About.AdminsLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={adminsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default AboutEditAdminSelect;
