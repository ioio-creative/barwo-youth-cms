import { formatDateString, formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function Newsletter() {
  this.label = '';
  //this.order = null;
  this.fromDate = null;
  this.title_tc = '';
  this.title_sc = '';
  this.title_en = '';
  this.message_tc = '';
  this.message_sc = '';
  this.message_en = '';
  /* media */
  this.featuredImage = null;
  /* end of media */
  this.pageMeta = null;
  this.isEnabled = true;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

Newsletter.newslettersResponseTypes = {
  // input validation
  LABEL_REQUIRED: {
    type: 'LABEL_REQUIRED',
    msg: 'LABEL_REQUIRED'
  },
  FROM_DATE_REQUIRED: {
    type: 'FROM_DATE_REQUIRED',
    msg: 'FROM_DATE_REQUIRED'
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
  NEWSLETTER_SENT_BEFORE: {
    type: 'NEWSLETTER_SENT_BEFORE',
    msg: 'NEWSLETTER_SENT_BEFORE'
  },
  NEWSLETTER_NOT_EXISTS: {
    type: 'NEWSLETTER_NOT_EXISTS',
    msg: 'NEWSLETTER_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },
  NEWSLETTER_DELETED: {
    type: 'NEWSLETTER_DELETED',
    msg: 'NEWSLETTER_DELETED'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Newsletter.getNewsletterForDisplay = newsletter => {
  return {
    ...newsletter,
    // orderDisplay: Number.isInteger(newsletter.order)
    //   ? newsletter.order + 1
    //   : '',
    fromDateDisplay: newsletter.fromDate
      ? formatDateString(newsletter.fromDate)
      : null,
    lastModifyDTDisplay: formatDateTimeString(newsletter.lastModifyDT),
    lastModifyUserDisplay: newsletter.lastModifyUser
      ? newsletter.lastModifyUser.name
      : '',
    isEnabledDisplay: newsletter.isEnabled.toString()
  };
};

const displayFieldNames = [
  //'orderDisplay',
  'fromDateDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Newsletter.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Newsletter;
