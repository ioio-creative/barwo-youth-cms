import React, { useMemo } from 'react';
import LabelSortableListPair from 'components/form/LabelSortableListPair';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapToListItem = item => {
  return {
    ...item,
    value: item._id,
    label: item.label
  };
};

const Ordering = ({ items, onGetItems, listWidth, labelMessage }) => {
  // listItems
  const listItems = useMemo(
    _ => {
      return getArraySafe(items).map(mapToListItem);
    },
    [items]
  );

  return (
    <LabelSortableListPair
      isShowAddButton={false}
      isUseRemove={false}
      isUseToFirst={true}
      isUseToLast={true}
      listWidth={listWidth}
      labelMessage={labelMessage}
      name='ordering'
      pickedItems={listItems}
      getPickedItems={onGetItems}
    />
  );
};

export default Ordering;
