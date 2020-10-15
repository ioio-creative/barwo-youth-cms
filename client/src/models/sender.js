import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';

function Sender() {
  this.emailAddress = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';

  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Sender.senderResponseTypes = {
  // input validation
  EMAILADDRESS_INVALID: {
    type: 'EMAILADDRESS_INVALID',
    msg: 'EMAILADDRESS_INVALID'
  },
  NAME_TC_REQUIRED: {
    type: 'NAME_TC_REQUIRED',
    msg: 'NAME_TC_REQUIRED'
  },
  NAME_SC_REQUIRED: {
    type: 'NAME_SC_REQUIRED',
    msg: 'NAME_SC_REQUIRED'
  },
  NAME_EN_REQUIRED: {
    type: 'NAME_EN_REQUIRED',
    msg: 'NAME_EN_REQUIRED'
  },

  // db check
  SENDER_NOT_EXISTS: {
    type: 'SENDER_NOT_EXISTS',
    msg: 'SENDER_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Sender.getSenderForDisplay = sender => {
  return {
    ...sender,
    lastModifyDTDisplay: formatDateTimeString(sender.lastModifyDT),
    lastModifyUserDisplay: sender.lastModifyUser
      ? sender.lastModifyUser.name
      : ''
  };
};

/* end of statics */

export default Sender;
