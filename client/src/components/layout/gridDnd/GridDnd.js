import React, { useCallback, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './DragItem';
import { Grid, GridImage, GridItem } from './Grid';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import isFunction from 'utils/js/function/isFunction';
import guid from 'utils/guid';

// https://medium.com/better-programming/how-to-build-a-drag-and-drop-grid-in-react-3008c5384b29

/* constants */

const ItemRemoveButton = LabelSortableListPair.ItemRemoveButton;

/* end of constants */

/* helper functions */

const move = (array, oldIndex, newIndex) => {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
};

const moveElement = (array, index, offset) => {
  const newIndex = index + offset;
  return move(array, index, newIndex);
};

/* end of helper functions */

/* default props examples */

const ItemExample = ({ item, handleItemRemoved, index }) => {
  /* event handlers */

  const onRemoveButtonClick = useCallback(
    _ => {
      handleItemRemoved(index);
    },
    [handleItemRemoved, index]
  );

  /* end of event handlers */

  return (
    <>
      <GridImage src={item.src} />
      <div className='close-btn'>
        {isFunction(handleItemRemoved) ? (
          <ItemRemoveButton onClick={onRemoveButtonClick} />
        ) : null}
      </div>
    </>
  );
};

const itemRenderExample = ({ handleItemRemoved, ...item }, index) => {
  return (
    <ItemExample
      item={item}
      handleItemRemoved={handleItemRemoved}
      index={index}
    />
  );
};

/* end of default props examples */

// item should have draggableId
const GridDnd = ({
  items,
  onChange,
  itemRender,
  backgroundColor,
  isUseRemove
}) => {
  // it's like componentDidMount.
  // gridId is set only when the component is initiated.
  // used to set type in DragItem, to specify items in the same grid
  const [gridId, setGridId] = useState(guid());

  /* methods */

  const masterOnChange = useCallback(
    newItems => {
      onChange(newItems);
    },
    [onChange]
  );

  const moveItem = useCallback(
    (sourceId, destinationId) => {
      const sourceIndex = items.findIndex(
        item => item.draggableId === sourceId
      );
      const destinationIndex = items.findIndex(
        item => item.draggableId === destinationId
      );

      // If source/destination is unknown, do nothing.
      if (sourceId === -1 || destinationId === -1) {
        return;
      }

      const offset = destinationIndex - sourceIndex;
      const itemsCopy = [...items];
      masterOnChange(moveElement(itemsCopy, sourceIndex, offset));
    },
    [items, masterOnChange]
  );

  /* end of methods */

  /* event handlers */

  const handleItemRemoved = useMemo(
    _ => {
      return isUseRemove
        ? idxRemoved => {
            const newItems = items.filter((_, idx) => idx !== idxRemoved);
            masterOnChange(newItems);
          }
        : null;
    },
    [items, isUseRemove, masterOnChange]
  );

  /* end of event handlers */

  /* values derived from props */

  const expandedItems = useMemo(
    _ => {
      return getArraySafe(items).map(item => ({
        ...item,
        handleItemRemoved
      }));
    },
    [items, handleItemRemoved]
  );

  /* end of values derived from props */

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid backgroundColor={backgroundColor}>
        {expandedItems.map((item, index) => (
          <DragItem
            key={item.draggableId}
            draggableId={item.draggableId}
            onMoveItem={moveItem}
            type={gridId}
          >
            <GridItem>{itemRender(item, index)}</GridItem>
          </DragItem>
        ))}
      </Grid>
    </DndProvider>
  );
};

GridDnd.defaultProps = {
  itemRender: itemRenderExample,
  isUseRemove: true
};

GridDnd.ItemRemoveButton = ItemRemoveButton;

export default GridDnd;
