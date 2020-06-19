import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
function Item(_id, content) {
  this._id = _id;
  this.content = content;
}

const getItemsExample = count =>
  Array.from({ length: count }, (v, k) => k).map(
    k => new Item(`item-${k}`, `item ${k}`)
  );

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyleExample = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

const itemRenderExample = ({ _id, content }, index) => (
  <Draggable key={_id} draggableId={_id} index={index}>
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
        {content}
      </div>
    )}
  </Draggable>
);

const onDragEndExample = reorderedItems => {
  console.log('onDragEnd:', reorderedItems);
};

// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md
const SortableList = ({ _id, items, itemRender, onDragEnd }) => {
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
    [items]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={_id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map(itemRender)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

SortableList.defaultProps = {
  droppableId: Date.now(), //'droppable',
  items: getItemsExample(10),
  itemRender: itemRenderExample,
  onDragEnd: onDragEndExample
};

export default SortableList;
