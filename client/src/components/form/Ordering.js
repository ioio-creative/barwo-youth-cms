import React, { useMemo } from 'react';
import PickValues from 'components/form/PickValues';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapToListItem = item => {
  return {
    ...item,
    value: item._id,
    label: item.label
  };
};

const Ordering = ({ items, onGetItems }) => {
  // listItems
  const listItems = useMemo(
    _ => {
      return getArraySafe(items).map(mapToListItem);
    },
    [items]
  );

  return (
    <PickValues
      isUseSelect={false}
      name='ordering'
      labelMessage=''
      pickedItems={listItems}
      getPickedItems={onGetItems}
    />
  );
};

export default Ordering;
