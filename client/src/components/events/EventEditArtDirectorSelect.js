import React, { useContext, useMemo, useCallback } from 'react';
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
  // art director options
  const { artDirectors, artDirectorsLoading } = useContext(ArtistsContext);
  const artDirectorOptions = useMemo(
    _ => {
      return getArraySafe(artDirectors).map(mapArtistToListItem);
    },
    [artDirectors]
  );

  // art directors in picked list
  const artDirectorsInPickedList = useMemo(
    _ => {
      return artDirectorsPicked.map(mapArtistToListItem);
    },
    [artDirectorsPicked]
  );

  /* methods */

  const dealWithGetArtDirectorsPicked = useCallback(
    newItemList => {
      onGetArtDirectorsPicked(newItemList);
    },
    [onGetArtDirectorsPicked]
  );

  /* end of methods */

  /* event handlers */

  const onGetPickedItems = useCallback(
    newItemList => {
      dealWithGetArtDirectorsPicked(newItemList);
    },
    [dealWithGetArtDirectorsPicked]
  );

  /* end of event handlers */

  return (
    <PickValues
      name='artDirectors'
      labelMessage={uiWordings['Event.ArtDirectorsLabel']}
      selectOptions={artDirectorOptions}
      selectIsLoading={artDirectorsLoading}
      selectPlaceholder={uiWordings['EventEdit.SelectArtDirectorsPlaceholder']}
      pickedItems={artDirectorsInPickedList}
      getPickedItems={onGetPickedItems}
    />
  );
};

export default EventEditArtDirectorSelect;
