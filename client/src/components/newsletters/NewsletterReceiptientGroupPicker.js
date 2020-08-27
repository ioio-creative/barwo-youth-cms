import React, { useContext, useMemo } from 'react';
import ContactsContext from 'contexts/contacts/contactsContext';
import PickValues from 'components/form/PickValues';
import uiWordings from 'globals/uiWordings';
import { getArraySafe } from 'utils/js/array/isNonEmptyArray';

const mapContactToListItem = contact => {
  return {
    ...contact,
    value: contact._id,
    label: contact.label
  };
};

const NewsletterEditReceiptientSelect = ({
  receiptientsPicked,
  onGetReceiptientsPicked
}) => {
  // fetched options
  const {
    receiptients: fetchedOptions,
    receiptientsLoading: fetchedOptionsLoading
  } = useContext(ContactsContext);
  const options = useMemo(
    _ => {
      return getArraySafe(fetchedOptions).map(mapContactToListItem);
    },
    [fetchedOptions]
  );

  // picked list
  const pickedList = useMemo(
    _ => {
      return getArraySafe(receiptientsPicked).map(mapContactToListItem);
    },
    [receiptientsPicked]
  );

  return (
    <PickValues
      name='receiptients'
      labelMessage={uiWordings['Newsletter.ReceiptientsLabel']}
      selectOptions={options}
      selectIsLoading={fetchedOptionsLoading}
      selectPlaceholder={
        uiWordings['NewsletterEdit.SelectReceiptientsPlaceholder']
      }
      pickedItems={pickedList}
      getPickedItems={onGetReceiptientsPicked}
    />
  );
};

export default NewsletterEditReceiptientSelect;
