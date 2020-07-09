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

const LandingPageEditFeaturedArtistSelect = ({
  featuredArtistsPicked,
  onGetFeaturedArtistsPicked
}) => {
  // fetched options
  const {
    eventArtists: fetchedOptions,
    eventArtistsLoading: fetchedOptionsLoading
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
      return featuredArtistsPicked.map(mapArtistToListItem);
    },
    [featuredArtistsPicked]
  );

  return (
    <PickValues
      name='featuredArtists'
      labelMessage={uiWordings['LandingPage.FeaturedArtistsLabel']}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={
        uiWordings['LandingPageEdit.SelectFeaturedArtistsPlaceholder']
      }
      pickedItems={pickedList}
      getPickedItems={onGetFeaturedArtistsPicked}
    />
  );
};

export default LandingPageEditFeaturedArtistSelect;
