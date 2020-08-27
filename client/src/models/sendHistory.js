import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import { getArraySafe } from '../utils/js/array/isNonEmptyArray';

function SendHistory() {
  this.label = '';
  this.recipients = [];
  this.title_tc = '';
  this.message_tc = '';
  this.title_sc = '';
  this.message_sc = '';
  this.title_en = '';
  this.message_en = '';
  this.email = '';
  this.sendDT = null;
  this.sender = null;
}

const recipientGroups = {
  MEDIA: { value: 'MEDIA', _id: 'MEDIA', label: 'Media/Press' },
  EDM: { value: 'EDM', _id: 'EDM', label: 'EDM Subscribers' },
  YMT: { value: 'YMT', _id: 'YMT', label: 'Committee (YMT)' },
  BARWO: { value: 'BARWO', _id: 'BARWO', label: 'Committee (BARWO)' },
  PRIMANY: { value: 'PRIMANY', _id: 'PRIMANY', label: 'Primary School' },
  SECONDARY: {
    value: 'SECONDARY',
    _id: 'SECONDARY',
    label: 'Secondary School'
  },
  UNIVERSITY: { value: 'UNIVERSITY', _id: 'UNIVERSITY', label: 'University' },
  FAMILY: { value: 'FAMILY', _id: 'FAMILY', label: 'Family' }
};

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
    senderDisplay: sendHistory.sender ? sendHistory.sender.name : '',
    recipientsDisplay:
      !sendHistory.recipients || sendHistory.recipients.length === 0
        ? 'All'
        : getArraySafe(sendHistory.recipients)
            .filter(x => x)
            .map(group => {
              return recipientGroups[group].label;
            })
  };
};

const displayFieldNames = [
  'sendDTDisplay',
  'senderDisplay',
  'recipientsDisplay'
];

SendHistory.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default SendHistory;
