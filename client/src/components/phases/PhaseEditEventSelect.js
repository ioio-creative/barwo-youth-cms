import React, { useContext, useMemo } from 'react';
import EventsContext from 'contexts/events/eventsContext';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapEventToListItem = event => {
  return {
    ...event,
    value: event._id,
    label: event.label
  };
};

const PhaseEditEventSelect = ({ eventsPicked, onGetEventsPicked }) => {
  // fetched options
  const {
    phaseEvents: fetchedOptions,
    phaseEventsLoading: fetchedOptionsLoading
  } = useContext(EventsContext);
  const options = useMemo(
    _ => {
      return getArraySafe(fetchedOptions).map(mapEventToListItem);
    },
    [fetchedOptions]
  );

  // picked list
  const pickedList = useMemo(
    _ => {
      return eventsPicked.map(mapEventToListItem);
    },
    [eventsPicked]
  );

  return (
    <PickValues
      name='events'
      labelMessage={uiWordings['Phase.EventsLabel']}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={uiWordings['PhaseEdit.SelectEventsPlaceholder']}
      pickedItems={pickedList}
      getPickedItems={onGetEventsPicked}
    />
  );
};

export default PhaseEditEventSelect;
