import React, { memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// https://medium.com/better-programming/how-to-build-a-drag-and-drop-grid-in-react-3008c5384b29

const dragTypeDefault = 'GENERAL';

// item should have draggableId
const DragItem = memo(({ draggableId, onMoveItem, children, type }) => {
  const ref = useRef(null);

  const [{ isDragging }, connectDrag] = useDrag({
    item: { draggableId, type },
    collect: monitor => {
      return {
        isDragging: monitor.isDragging()
      };
    }
  });

  const [, connectDrop] = useDrop({
    accept: type,
    drop(hoveredOverItem) {
      if (hoveredOverItem.draggableId !== draggableId) {
        onMoveItem(hoveredOverItem.draggableId, draggableId);
      }
    }
  });

  connectDrag(ref);
  connectDrop(ref);

  const opacity = isDragging ? 0.5 : 1;
  const containerStyle = { opacity, cursor: 'pointer' };

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      forwardedRef: ref,
      style: containerStyle
    })
  );
});

DragItem.defaultProps = {
  type: dragTypeDefault
};

export default DragItem;
