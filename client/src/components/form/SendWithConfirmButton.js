import React, { useCallback, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from 'components/form/Button';
import ContactEditGroupSelect from '../contacts/ContactEditGroupSelect';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import uiWordings from 'globals/uiWordings';
import ContactsState from 'contexts/contacts/contactsState';

const AlertMessage = ({ setOutside }) => {
  const [groupsPicked, setGroupsPicked] = useState([]);
  const onGetGroupsPicked = useCallback(
    newItemList => {
      setGroupsPicked(newItemList);
      setOutside(newItemList);
    },
    [groupsPicked, setOutside]
  );
  return (
    <div>
      <ContactsState>
        <ContactEditGroupSelect
          groupsPicked={groupsPicked}
          onGetGroupsPicked={onGetGroupsPicked}
        />
      </ContactsState>
    </div>
  );
};

const SendWithConfirmButton = ({
  className,
  disabled,
  children,
  confirmTitle,
  confirmMessage,
  confirmYesLabel,
  confirmNoLabel,
  onConfirmYes,
  onConfirmNo
}) => {
  const [groupsPicked, setGroupsPicked] = useState([]);

  const handleConfirmYes = useCallback(
    _ => {
      console.log('yes');
      setGroupsPicked(prevGroupPicked => {
        invokeIfIsFunction(onConfirmYes, prevGroupPicked);
        return prevGroupPicked;
      });
    },
    [onConfirmYes]
  );

  const handleConfirmNo = useCallback(
    _ => {
      invokeIfIsFunction(onConfirmNo);
    },
    [onConfirmNo]
  );

  const onClick = useCallback(
    _ => {
      confirmAlert({
        title: confirmTitle,
        message: confirmMessage,
        childrenElement: () => {
          return <AlertMessage setOutside={setGroupsPicked} />;
        },
        buttons: [
          {
            label: confirmYesLabel,
            onClick: handleConfirmYes
          },
          {
            label: confirmNoLabel,
            onClick: handleConfirmNo
          }
        ]
      });
    },
    [
      confirmTitle,
      confirmYesLabel,
      confirmNoLabel,
      handleConfirmYes,
      handleConfirmNo
    ]
  );

  return (
    <Button
      color='blue'
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

SendWithConfirmButton.defaultProps = {
  confirmTitle: uiWordings['SendWithConfirmButton.ConfirmTitle'],
  confirmMessage: uiWordings['SendWithConfirmButton.ConfirmMessage'],
  confirmYesLabel: uiWordings['SendWithConfirmButton.ConfirmYesLabel'],
  confirmNoLabel: uiWordings['SendWithConfirmButton.ConfirmNoLabel']
};

const SendWithConfirmButtonWithContainer = props => (
  <ContactsState>
    <SendWithConfirmButton {...props} />
  </ContactsState>
);

export default SendWithConfirmButtonWithContainer;
