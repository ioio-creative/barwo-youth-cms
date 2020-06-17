import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function Event() {
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.writer_tc = '';
  this.writer_sc = '';
  this.writer_en = '';
  this.artDirectors = [];
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Event.eventsResponseTypes = {
  // input validation
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
  EVENT_NOT_EXISTS: {
    type: 'EVENT_NOT_EXISTS',
    msg: 'EVENT_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Event.getEventForDisplay = event => {
  return {
    ...event,
    createDTDisplay: formatDateTimeString(event.createDT),
    lastModifyDTDisplay: formatDateTimeString(event.lastModifyDT),
    lastModifyUserDisplay: event.lastModifyUser
      ? event.lastModifyUser.name
      : '',
    isEnabledDisplay: event.isEnabled.toString()
  };
};

const displayFieldNames = [
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Event.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Event;