import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AlertContext from 'contexts/alert/alertContext';
import SendHistoriesContext from 'contexts/sendHistories/sendHistoriesContext';
import SendHistoryPageContainer from 'components/sendhistory/sendHistoryPageContainer';
import Alert from 'models/alert';
import Loading from 'components/layout/loading/DefaultLoading';
import Region from 'components/layout/Region';
import Form from 'components/form/Form';
import LabelLabelPair from 'components/form/LabelLabelPair';
import LabelRichTextbox from '../form/LabelRichTextbox';
import LinkButton from 'components/form/LinkButton';
import SendHistory from 'models/sendHistory';
import uiWordings from 'globals/uiWordings';
import routes from 'globals/routes';
import isNonEmptyArray from 'utils/js/array/isNonEmptyArray';

const emptySendHistory = new SendHistory();
const defaultState = emptySendHistory;

const SendHistoryView = _ => {
  const { sendHistoryId } = useParams();
  const { setAlerts, removeAlerts } = useContext(AlertContext);
  const {
    sendHistory: fetchedSendHistory,
    sendHistoriesErrors,
    sendHistoriesLoading,
    getSendHistory,
    clearSendHistory,
    clearSendHistoriesErrors
  } = useContext(SendHistoriesContext);

  const [sendHistory, setSendHistory] = useState(defaultState);
  const [isAbandonEdit, setIsAbandonEdit] = useState(false);

  // componentDidMount
  useEffect(_ => {
    return _ => {
      removeAlerts();
    };
    // eslint-disable-next-line
  }, []);

  // SendHistoryId
  useEffect(
    _ => {
      if (sendHistoryId) {
        getSendHistory(sendHistoryId);
      }

      return _ => {
        clearSendHistory();
      };
    },
    [sendHistoryId, getSendHistory, clearSendHistory]
  );

  // fetchedSendHistory
  useEffect(
    _ => {
      setSendHistory(
        fetchedSendHistory
          ? SendHistory.getSendHistoryForDisplay(fetchedSendHistory)
          : defaultState
      );
    },
    [fetchedSendHistory]
  );

  // sendHistoriesErrors
  useEffect(
    _ => {
      if (isNonEmptyArray(sendHistoriesErrors)) {
        setAlerts(
          sendHistoriesErrors.map(SendHistoryError => {
            return new Alert(
              SendHistory.sendHistoryResponseTypes[SendHistoryError].msg,
              Alert.alertTypes.WARNING
            );
          })
        );
        clearSendHistoriesErrors();

        if (
          sendHistoriesErrors.includes(
            SendHistory.sendHistoryResponseTypes.SENDHISTORY_NOT_EXISTS.type
          )
        ) {
          setIsAbandonEdit(true);
        }
      }
    },
    [sendHistoriesErrors, setAlerts, clearSendHistoriesErrors]
  );

  /* methods */

  /* end of methods */

  /* event handlers */

  /* end of event handlers */

  if (sendHistoriesLoading) {
    return <Loading />;
  }

  const backToSendHistoryListButton = (
    <Form>
      <LinkButton to={routes.sendHistoryList(true)}>
        {uiWordings['SendHistoryView.BackToSendHistoryList']}
      </LinkButton>
    </Form>
  );

  if (isAbandonEdit) {
    return <>{backToSendHistoryListButton}</>;
  }

  return (
    <>
      {backToSendHistoryListButton}

      <div>
        <h4>{uiWordings['SendHistoryView.ViewSendHistory']}</h4>
        <LabelLabelPair
          value={sendHistory.label}
          labelMessage={uiWordings['SendHistory.LabelLabel']}
        />

        <Region>
          <LabelLabelPair
            value={sendHistory.title_tc}
            labelMessage={uiWordings['SendHistory.TitleTcLabel']}
          />
          <LabelRichTextbox
            value={sendHistory.message_tc}
            disabled={true}
            labelMessage={uiWordings['SendHistory.MessageTcLabel']}
          />
        </Region>

        <Region>
          <LabelLabelPair
            value={sendHistory.title_sc}
            labelMessage={uiWordings['SendHistory.TitleScLabel']}
          />
          <LabelRichTextbox
            value={sendHistory.message_sc}
            disabled={true}
            labelMessage={uiWordings['SendHistory.MessageScLabel']}
          />
        </Region>

        <Region>
          <LabelLabelPair
            value={sendHistory.title_en}
            labelMessage={uiWordings['SendHistory.TitleEnLabel']}
          />
          <LabelRichTextbox
            value={sendHistory.message_en}
            disabled={true}
            labelMessage={uiWordings['SendHistory.MessageEnLabel']}
          />
        </Region>

        <LabelLabelPair
          value={sendHistory.sendDTDisplay}
          labelMessage={uiWordings['SendHistory.SendDTLabel']}
        />
        <LabelLabelPair
          value={sendHistory.senderDisplay}
          labelMessage={uiWordings['SendHistory.SenderLabel']}
        />
      </div>
    </>
  );
};

const SendHistoryViewWithContainer = _ => (
  <SendHistoryPageContainer>
    <SendHistoryView />
  </SendHistoryPageContainer>
);

export default SendHistoryViewWithContainer;
