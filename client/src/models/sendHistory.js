import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function SendHistory() {
  this.label = '';
  this.title_tc = '';
  this.message_tc = '';
  this.title_sc = '';
  this.message_sc = '';
  this.title_en = '';
  this.message_en = '';
  this.sendDT = null;
  this.sender = null;
}

SendHistory.sendHistoryResponseTypes = {
  // input validation
  LABEL_REQUIRED: {
    type: 'LABEL_REQUIRED',
    msg: 'LABEL_REQUIRED'
  },
  TITLE_TC_REQUIRED: {
    type: 'TITLE_TC_REQUIRED',
    msg: 'TITLE_TC_REQUIRED'
  },
  TITLE_SC_REQUIRED: {
    type: 'TITLE_SC_REQUIRED',
    msg: 'TITLE_SC_REQUIRED'
  },
  TITLE_EN_REQUIRED: {
    type: 'TITLE_EN_REQUIRED',
    msg: 'TITLE_EN_REQUIRED'
  },
  MESSAGE_TC_REQUIRED: {
    type: 'MESSAGE_TC_REQUIRED',
    msg: 'MESSAGE_TC_REQUIRED'
  },
  MESSAGE_SC_REQUIRED: {
    type: 'MESSAGE_SC_REQUIRED',
    msg: 'MESSAGE_SC_REQUIRED'
  },
  MESSAGE_EN_REQUIRED: {
    type: 'MESSAGE_EN_REQUIRED',
    msg: 'MESSAGE_EN_REQUIRED'
  },

  // db check
  SENDHISTORY_NOT_EXISTS: {
    type: 'SENDHISTORY_NOT_EXISTS',
    msg: 'SENDHISTORY_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    meg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

SendHistory.getSendHistoryForDisplay = sendHistory => {
  return {
    ...sendHistory,
    sendDTDisplay: formatDateTimeString(sendHistory.sendDT),
    senderDisplay: sendHistory.sender ? sendHistory.sender.name : ''
  };
};

const displayFieldNames = ['sendDTDisplay', 'senderDisplay'];

SendHistory.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default SendHistory;
