import React, { useContext, useMemo } from 'react';
import NewsMediaItemsContext from 'contexts/newsMediaItems/newsMediaItemsContext';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapNewsMediaItemToListItem = newsMediaItem => {
  return {
    ...newsMediaItem,
    value: newsMediaItem._id,
    label: newsMediaItem.label
  };
};

const NewsMediaGroupEditNewsMediaItemSelect = ({
  newsMediaItemsPicked,
  onGetNewsMediaItemsPicked
}) => {
  // fetched options
  const {
    newsMediaItems: fetchedOptions,
    newsMediaItemsLoading: fetchedOptionsLoading
  } = useContext(NewsMediaItemsContext);
  const options = useMemo(
    _ => {
      return getArraySafe(fetchedOptions).map(mapNewsMediaItemToListItem);
    },
    [fetchedOptions]
  );

  // picked list
  const pickedList = useMemo(
    _ => {
      return getArraySafe(newsMediaItemsPicked).map(mapNewsMediaItemToListItem);
    },
    [newsMediaItemsPicked]
  );

  return (
    <PickValues
      name='newsMediaItems'
      labelMessage={uiWordings['NewsMediaGroup.NewsMediaItemsLabel']}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={
        uiWordings['NewsMediaGroupEdit.SelectNewsMediaItemsPlaceholder']
      }
      pickedItems={pickedList}
      getPickedItems={onGetNewsMediaItemsPicked}
    />
  );
};

export default NewsMediaGroupEditNewsMediaItemSelect;
