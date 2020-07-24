import React, { useCallback, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import guid from 'utils/guid';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import ListItem from './models/ListItem';
import uiWordings from 'globals/uiWordings';
import './SortableList.css';

/* globals */

let listWidthGlobal = 250;

/* end of globals */

// fake data generator
const getItemsExample = count =>
  Array.from({ length: count }, (v, k) => k).map(
    k => new ListItem(`item-${k}`, `item ${k}`)
  );

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ItemRemoveButton = ({ className, onClick }) => {
  return (
    <span
      title={uiWordings['SortableList.ItemRemoveButton.Tooltip']}
      className={`w3-margin-left item-button ${className || ''}`}
      onClick={onClick}
    >
      <i className='fa fa-times' />
    </span>
  );
};

const ItemToFirstButton = ({ className, onClick }) => {
  return (
    <span
      title={uiWordings['SortableList.ItemToFirstButton.Tooltip']}
      className={`item-button ${className || ''}`}
      onClick={onClick}
    >
      <i className='fa fa-chevron-circle-up' />
    </span>
  );
};

const ItemToLastButton = ({ className, onClick }) => {
  return (
    <span
      title={uiWordings['SortableList.ItemToLastButton.Tooltip']}
      className={`w3-margin-left item-button ${className || ''}`}
      onClick={onClick}
    >
      <i className='fa fa-chevron-circle-down' />
    </span>
  );
};

const grid = 8;

const getItemStyleExample = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid, //grid * 2,
  margin: `0 0 ${grid}px 0`, //`0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white', //isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyleExample = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: `${grid}px ${grid}px ${grid * 0.5}px ${grid}px`,
  width: listWidthGlobal
});

const ItemExample = ({
  index,
  value,
  label,
  onItemRemoved,
  onItemToFirst,
  onItemToLast
}) => {
  return (
    <Draggable key={value} draggableId={value} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyleExample(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {label}
          <div className='w3-right'>
            {isFunction(onItemToFirst) ? (
              <ItemToFirstButton onClick={_ => onItemToFirst(index)} />
            ) : null}
            {isFunction(onItemToLast) ? (
              <ItemToLastButton onClick={_ => onItemToLast(index)} />
            ) : null}
            {isFunction(onItemRemoved) ? (
              <ItemRemoveButton onClick={_ => onItemRemoved(index)} />
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const itemRenderExample = (
  { value, label, handleItemRemoved, handleItemToFirst, handleItemToLast },
  index
) => {
  return (
    <ItemExample
      key={value}
      index={index}
      value={value}
      label={label}
      onItemRemoved={handleItemRemoved}
      onItemToFirst={handleItemToFirst}
      onItemToLast={handleItemToLast}
    />
  );
};

const onDragEndExample = reorderedItems => {
  console.log('onDragEnd:', reorderedItems);
};

// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md
const SortableList = ({
  _id,
  items,
  listWidth,
  itemRender,
  getListStyle,
  onDragEnd,
  onItemRemoved,
  onItemChange,
  onItemToFirst,
  onItemToLast
}) => {
  /* useEffects */

  // listWidth
  useEffect(
    _ => {
      listWidthGlobal = listWidth;
    },
    [listWidth]
  );

  /* end of useEffects */

  /* event handlers */

  const handleDragEnd = useCallback(
    result => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const reorderedItems = reorder(
        items,
        result.source.index,
        result.destination.index
      );

      onDragEnd(reorderedItems);
    },
    [items, onDragEnd]
  );

  const handleItemRemoved = useMemo(
    _ => {
      return isFunction(onItemRemoved)
        ? idxRemoved => {
            const newItems = items.filter((_, idx) => idx !== idxRemoved);
            onItemRemoved(newItems);
          }
        : null;
    },
    [items, onItemRemoved]
  );

  const handleItemChange = useMemo(
    _ => {
      return isFunction(onItemChange)
        ? (newItem, newItemIdx) => {
            const newItems = items.map((item, idx) => {
              if (idx !== newItemIdx) {
                return item;
              }
              return newItem;
            });
            onItemChange(newItems);
          }
        : null;
    },
    [items, onItemChange]
  );

  const handleItemToFirst = useMemo(
    _ => {
      return isFunction(onItemToFirst)
        ? itemIdx => {
            const newItems = items.filter((_, idx) => idx !== itemIdx);
            newItems.unshift(items[itemIdx]);
            onItemToFirst(newItems);
          }
        : null;
    },
    [items, onItemToFirst]
  );

  const handleItemToLast = useMemo(
    _ => {
      return isFunction(onItemToLast)
        ? itemIdx => {
            const newItems = items.filter((_, idx) => idx !== itemIdx);
            newItems.push(items[itemIdx]);
            onItemToLast(newItems);
          }
        : null;
    },
    [items, onItemToLast]
  );

  /* end of event handlers */

  /* values derived from props */

  const expandedItems = useMemo(
    _ => {
      return items.map(item => ({
        ...item,
        handleItemRemoved,
        handleItemChange,
        handleItemToFirst,
        handleItemToLast
      }));
    },
    [
      items,
      handleItemRemoved,
      handleItemChange,
      handleItemToFirst,
      handleItemToLast
    ]
  );

  /* end of values derived from props */

  if (!isNonEmptyArray(items)) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={_id}>
        {(provided, snapshot) => (
          <div
            className='sortable-list'
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {expandedItems.map(itemRender)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

SortableList.defaultProps = {
  _id: guid(), //'droppable',
  items: getItemsExample(10),
  listWidth: listWidthGlobal,
  itemRender: itemRenderExample,
  getListStyle: getListStyleExample,
  onDragEnd: onDragEndExample
};

SortableList.getListStyleDefault = getListStyleExample;
SortableList.getItemStyleDefault = getItemStyleExample;
SortableList.ItemRemoveButton = ItemRemoveButton;
SortableList.ItemToFirstButton = ItemToFirstButton;
SortableList.ItemToLastButton = ItemToLastButton;

export default SortableList;
