import React, { useMemo } from 'react';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';
import Contact from 'models/contact';

const mapContactToListItem = inputContact => {
  // console.log(inputContact);
  if (typeof inputContact === 'string') {
    const contact = Contact.contactGroups[inputContact];
    return { _id: contact._id, value: contact.value, label: contact.label };
  }

  return inputContact;
};

const fetchedOptions = [
  { _id: 'MEDIA', value: 'MEDIA', label: 'Media/Press' },
  { _id: 'EDM', value: 'EDM', label: 'EDM Subscribers' },
  { _id: 'YMT', value: 'YMT', label: 'Committee (YMT)' },
  { _id: 'BARWO', value: 'BARWO', label: 'Committee (BARWO)' },
  { _id: 'PRIMANY', value: 'PRIMANY', label: 'Primary School' },
  {
    _id: 'SECONDARY',
    value: 'SECONDARY',
    label: 'Secondary School'
  },
  { _id: 'UNIVERSITY', value: 'UNIVERSITY', label: 'University' },
  { _id: 'FAMILY', value: 'FAMILY', label: 'Family' }
];

const ContactEditGroupSelect = ({ groupsPicked, onGetGroupsPicked }) => {
  // fetched options

  const options = useMemo(_ => {
    return getArraySafe(fetchedOptions).map(mapContactToListItem);
  }, []);

  // picked list
  const pickedList = useMemo(
    _ => {
      return getArraySafe(groupsPicked).map(mapContactToListItem);
    },
    [groupsPicked]
  );

  return (
    <PickValues
      name='groups'
      labelMessage={uiWordings['Contact.GroupsLabel']}
      selectOptions={options}
      selectIsLoading={false}
      selectPlaceholder={uiWordings['ContactEdit.SelectGroupsPlaceholder']}
      pickedItems={pickedList}
      getPickedItems={onGetGroupsPicked}
    />
  );
};

export default ContactEditGroupSelect;
