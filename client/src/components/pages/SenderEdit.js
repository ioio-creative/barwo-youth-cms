import React, { useContext, useState, useEffect, useCallback } from 'react';
import Alert from 'models/alert';
import AlertContext from 'contexts/alert/alertContext';
import Sender from 'models/sender';
import SenderContext from 'contexts/sender/senderContext';
import SenderPageContainer from 'components/newsletters/SenderPageContainer';
import Loading from 'components/layout/loading/DefaultLoading';
import Form from 'components/form/Form';
import LabelInputTextPair from 'components/form/LabelInputTextPair';
import LabelLabelPair from 'components/form/LabelLabelPair';
import SubmitButton from 'components/form/SubmitButton';
import uiWordings from 'globals/uiWordings';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';
import scrollToTop from 'utils/ui/scrollToTop';

const originalSender = new Sender();
const defaultState = originalSender;
const SenderEdit = _ => {
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    sender: fetchedSender,
    senderErrors,
    senderLoading,
    getSender,
    clearSender,
    clearSenderErrors,
    updateSender
  } = useContext(SenderContext);

  const [sender, setSender] = useState(defaultState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // componentDidMount
  useEffect(_ => {
    getSender();
    return _ => {
      clearSender();
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // fetchedSender
  useEffect(
    _ => {
      setSender(
        fetchedSender ? Sender.getSenderForDisplay(fetchedSender) : defaultState
      );
      setIsAddMode(!fetchedSender);
    },
    [fetchedSender]
  );

  // senderErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(senderErrors)) {
        setAlerts(
          senderErrors
            .filter(errorType => {
              return (
                errorType !== Sender.senderResponseTypes.SENDER_NOT_EXISTS.type
              );
            })
            .map(senderError => {
              return new Alert(
                Sender.senderResponseTypes[senderError].msg,
                Alert.alertTypes.WARNING
              );
            })
        );
        clearSenderErrors();
      }
    },
    [senderErrors, setAlerts, clearSenderErrors]
  );

  /* methods */

  const validInput = useCallback(senderInput => {
    return true;
  }, []);

  /* end of methods */

  /* event handlers */

  const onChange = useCallback(
    e => {
      setIsSubmitEnabled(true);
      removeAlerts();
      const name = e.target.name;
      const value = e.target.value;
      setSender(prevSender => ({
        ...prevSender,
        [name]: value
      }));
    },
    [removeAlerts]
  );

  const onSubmit = useCallback(
    async e => {
      setIsSubmitEnabled(false);
      removeAlerts();
      e.preventDefault();

      let isSuccess = validInput(sender);
      let returnedSender = null;
      returnedSender = await updateSender(sender);
      isSuccess = Boolean(returnedSender);
      if (isSuccess) {
        setAlerts(
          new Alert(
            uiWordings['SenderEdit.UpdateSenderSuccessMessage'],
            Alert.alertTypes.INFO
          )
        );

        getSender();
      }

      scrollToTop();
    },
    [updateSender, getSender, sender, setAlerts, removeAlerts, validInput]
  );

  /* end of event handlers */

  if (senderLoading) {
    return <Loading />;
  }

  return (
    <Form onSubmit={onSubmit}>
      <h4>{uiWordings['SenderEdit.EditSenderTitle']}</h4>

      <LabelInputTextPair
        name='emailAddress'
        value={sender.emailAddress}
        labelMessage={uiWordings['Sender.EmailAddressLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />

      <LabelInputTextPair
        name='name_tc'
        value={sender.name_tc}
        labelMessage={uiWordings['Sender.NameTcLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='name_sc'
        value={sender.name_sc}
        labelMessage={uiWordings['Sender.NameScLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      <LabelInputTextPair
        name='name_en'
        value={sender.name_en}
        labelMessage={uiWordings['Sender.NameEnLabel']}
        placeholder=''
        onChange={onChange}
        required={true}
      />
      {!isAddMode && (
        <>
          <LabelLabelPair
            value={sender.lastModifyDTDisplay}
            labelMessage={uiWordings['Sender.LastModifyDTLabel']}
          />
          <LabelLabelPair
            value={sender.lastModifyUserDisplay}
            labelMessage={uiWordings['Sender.LastModifyUserLabel']}
          />
        </>
      )}
      <SubmitButton
        disabled={!isSubmitEnabled}
        label={uiWordings['SenderEdit.UpdateSenderSubmit']}
      />
    </Form>
  );
};

const SenderEditWithContainer = _ => (
  <SenderPageContainer>
    <SenderEdit />
  </SenderPageContainer>
);

export default SenderEditWithContainer;
