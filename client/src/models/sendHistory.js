import generalResponseTypes from 'types/responses/general';

function SendHistory() {
  this.title_tc = '';
  this.message_tc = '';
  this.title_sc = '';
  this.message_sc = '';
  this.title_en = '';
  this.message_en = '';
}

SendHistory.sendHistoryResponseTypes = {
  // input validation
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
  NEWSLETTER_NOT_EXISTS: {
    type: 'NEWSLETTER_NOT_EXISTS',
    msg: 'NEWSLETTER_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

/* end of statics */

export default SendHistory;
