import React, { useContext, useMemo } from 'react';
import ActivitiesContext from 'contexts/activities/activitiesContext';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapActivityToListItem = activity => {
  return {
    ...activity,
    value: activity._id,
    label: activity.label
  };
};

const LandingPageEditFeaturedActivitySelect = ({
  featuredActivitiesPicked,
  onGetFeaturedActivitiesPicked
}) => {
  // fetched options
  const {
    activitiesForSelect: fetchedOptions,
    activitiesForSelectLoading: fetchedOptionsLoading
  } = useContext(ActivitiesContext);

  const options = useMemo(
    _ => {
      return getArraySafe(fetchedOptions).map(mapActivityToListItem);
    },
    [fetchedOptions]
  );

  // picked list
  const pickedList = useMemo(
    _ => {
      return featuredActivitiesPicked.map(mapActivityToListItem);
    },
    [featuredActivitiesPicked]
  );

  return (
    <PickValues
      name='featuredActivities'
      labelMessage={uiWordings['LandingPage.FeaturedActivitiesLabel']}
      listWidth={500}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={
        uiWordings['LandingPageEdit.SelectFeaturedActivitiesPlaceholder']
      }
      pickedItems={pickedList}
      getPickedItems={onGetFeaturedActivitiesPicked}
    />
  );
};

export default LandingPageEditFeaturedActivitySelect;
