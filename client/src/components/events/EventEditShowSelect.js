import React, { useMemo, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import DatePicker from 'components/form/DatePicker';
import TimePicker from 'components/form/TimePicker';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';

/* constants */

const emptyShowForAdd = {
  date: new Date(),
  startTime: '19:30'
};

const mapShowToListItem = show => {
  return {
    ...show,
    draggableId: show.draggableId || show._id || guid()
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

const Item = ({ show, handleItemRemoved, handleItemChange, index }) => {
  /* methods */

  const dealWithItemChange = useCallback(
    newShow => {
      handleItemChange(newShow, index);
    },
    [handleItemChange, index]
  );

  /* event handlers */

  const onChange = useCallback(
    e => {
      const newShow = {
        ...show,
        [e.target.name]: e.target.value
      };
      dealWithItemChange(newShow);
    },
    [show, dealWithItemChange]
  );

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  const { date, startTime, draggableId } = show;

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
            <div className='w3-col m6'>
              <DatePicker name='date' value={date} onChange={onChange} />
            </div>
            <div className='w3-col m6'>
              <TimePicker
                name='startTime'
                value={startTime}
                onChange={onChange}
              />
            </div>
          </div>
          <div className='w3-rest'>
            {isFunction(handleItemRemoved) ? (
              <LabelSortableListPair.ItemRemoveButton
                className='w3-right'
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
  { handleItemRemoved, handleItemChange, ...show },
  index
) => {
  return (
    <Item
      key={index}
      show={show}
      handleItemRemoved={handleItemRemoved}
      handleItemChange={handleItemChange}
      index={index}
    />
  );
};

/* end of item */

const EventEditShowSelect = ({ shows, onGetShows }) => {
  const showsInPickedList = useMemo(
    _ => {
      return getArraySafe(shows).map(mapShowToListItem);
    },
    [shows]
  );

  /* methods */

  const dealWithGetShows = useCallback(
    newItemList => {
      onGetShows(newItemList);
    },
    [onGetShows]
  );

  const addShow = useCallback(
    _ => {
      dealWithGetShows([...getArraySafe(shows), emptyShowForAdd]);
    },
    [shows, dealWithGetShows]
  );

  /* end of methods */

  // // shows
  // useEffect(
  //   _ => {
  //     if (!isNonEmptyArray(shows)) {
  //       addShow();
  //     }
  //   },
  //   [shows, addShow]
  // );

  /* event handlers */

  const onAddButtonClick = useCallback(
    _ => {
      addShow();
    },
    [addShow]
  );

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetShows(newItemList);
    },
    [dealWithGetShows]
  );

  /* end of event handlers */

  return (
    <LabelSortableListPair
      name='shows'
      labelMessage={uiWordings['Event.ShowsLabel']}
      pickedItemRender={itemRender}
      getListStyle={getListStyle}
      pickedItems={showsInPickedList}
      getPickedItems={onGetPickedItems}
      onAddButtonClick={onAddButtonClick}
    />
  );
};

export default EventEditShowSelect;
