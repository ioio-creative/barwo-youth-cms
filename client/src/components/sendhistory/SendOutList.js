import React from 'react';
import Modal from 'components/layout/Modal';
import uiWordings from 'globals/uiWordings';
import SendHistory from 'models/sendHistory';
import SendHistoryList from '../pages/SendHistoryList';

const emptySendHistory = new SendHistory();
const defaultState = emptySendHistory;

const SendOutList = ({ newsletterId }) => {
  return (
    <Modal contentLabel={uiWordings['SendHistories.Title']}>
      <h4>{uiWordings['SendHistories.Title']}</h4>
      <SendHistoryList filter={newsletterId} />
    </Modal>
  );
};

SendOutList.defaultProps = {
  sendHistory: defaultState
};

export default SendOutList;
