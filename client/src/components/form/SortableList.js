import React, { useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import ListItem from './models/ListItem';
import './SortableList.css';

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
    <span className={`remove-btn ${className || ''}`} onClick={onClick}>
      <i className='fa fa-times' />
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
  width: 250
});

const itemRenderExample = ({ value, label, handleItemRemoved }, index) => {
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
          {isFunction(handleItemRemoved) ? (
            <ItemRemoveButton
              className='w3-right'
              onClick={_ => handleItemRemoved(index)}
            />
          ) : null}
        </div>
      )}
    </Draggable>
  );
};

const onDragEndExample = reorderedItems => {
  console.log('onDragEnd:', reorderedItems);
};

// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md
const SortableList = ({
  _id,
  items,
  itemRender,
  getListStyle,
  onDragEnd,
  onItemRemoved,
  onItemChange
}) => {
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

  /* end of event handlers */

  /* values derived from props */

  const expandedItems = useMemo(
    _ => {
      return items.map(item => ({
        ...item,
        handleItemRemoved,
        handleItemChange
      }));
    },
    [items, handleItemRemoved, handleItemChange]
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
  _id: Date.now().toString(), //'droppable',
  items: getItemsExample(10),
  itemRender: itemRenderExample,
  getListStyle: getListStyleExample,
  onDragEnd: onDragEndExample
};

SortableList.getListStyleDefault = getListStyleExample;
SortableList.getItemStyleDefault = getItemStyleExample;
SortableList.ItemRemoveButton = ItemRemoveButton;

export default SortableList;
