import React, { useCallback } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from 'components/form/Button';
import { invokeIfIsFunction } from 'utils/js/function/isFunction';
import uiWordings from 'globals/uiWordings';

const DeleteWithConfirmButton = ({
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
  const handleConfirmYes = useCallback(
    _ => {
      invokeIfIsFunction(onConfirmYes);
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
      confirmMessage,
      confirmYesLabel,
      confirmNoLabel,
      handleConfirmYes,
      handleConfirmNo
    ]
  );

  return (
    <Button
      color='red'
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

DeleteWithConfirmButton.defaultProps = {
  confirmTitle: uiWordings['DeleteWithConfirmButton.ConfirmTitle'],
  confirmMessage: uiWordings['DeleteWithConfirmButton.ConfirmMessage'],
  confirmYesLabel: uiWordings['DeleteWithConfirmButton.ConfirmYesLabel'],
  confirmNoLabel: uiWordings['DeleteWithConfirmButton.ConfirmNoLabel']
};

export default DeleteWithConfirmButton;
