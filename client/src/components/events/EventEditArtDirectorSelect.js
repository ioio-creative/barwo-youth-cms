import React, { useContext, useMemo } from 'react';
import ArtistsContext from 'contexts/artists/artistsContext';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapArtistToListItem = artist => {
  return {
    ...artist,
    value: artist._id,
    label: artist.label
  };
};

const EventEditArtDirectorSelect = ({
  artDirectorsPicked,
  onGetArtDirectorsPicked
}) => {
  // fetched options
  const {
    artDirectors: fetchedOptions,
    artDirectorsLoading: fetchedOptionsLoading
  } = useContext(ArtistsContext);
  const options = useMemo(
    _ => {
      return getArraySafe(fetchedOptions).map(mapArtistToListItem);
    },
    [fetchedOptions]
  );

  // picked list
  const pickedList = useMemo(
    _ => {
      return artDirectorsPicked.map(mapArtistToListItem);
    },
    [artDirectorsPicked]
  );

  return (
    <PickValues
      name='artDirectors'
      labelMessage={uiWordings['Event.ArtDirectorsLabel']}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={uiWordings['EventEdit.SelectArtDirectorsPlaceholder']}
      pickedItems={pickedList}
      getPickedItems={onGetArtDirectorsPicked}
    />
  );
};

export default EventEditArtDirectorSelect;
