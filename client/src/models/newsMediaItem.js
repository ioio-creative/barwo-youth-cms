import { formatDateString, formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function NewsMediaItem() {
  this.label = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.fromDate = null;
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  /* media */
  this.gallery = [];
  /* end of media */
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

NewsMediaItem.newsMediaItemsResponseTypes = {
  // input validation
  LABEL_REQUIRED: { type: 'LABEL_REQUIRED', msg: 'LABEL_REQUIRED' },
  NAME_TC_REQUIRED: { type: 'NAME_TC_REQUIRED', msg: 'NAME_TC_REQUIRED' },
  NAME_SC_REQUIRED: { type: 'NAME_SC_REQUIRED', msg: 'NAME_SC_REQUIRED' },
  NAME_EN_REQUIRED: { type: 'NAME_EN_REQUIRED', msg: 'NAME_EN_REQUIRED' },
  FROM_DATE_REQUIRED: {
    type: 'FROM_DATE_REQUIRED',
    msg: 'FROM_DATE_REQUIRED'
  },

  // db check
  NEWS_MEDIA_ITEM_NOT_EXISTS: {
    type: 'NEWS_MEDIA_ITEM_NOT_EXISTS',
    msg: 'NEWS_MEDIA_ITEM_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },
  NEWS_MEDIA_ITEM_INVOLVED_IN_GROUPS: {
    type: 'NEWS_MEDIA_ITEM_INVOLVED_IN_GROUPS',
    msg: 'NEWS_MEDIA_ITEM_INVOLVED_IN_GROUPS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

NewsMediaItem.getNewsMediaItemForDisplay = newsMediaItem => {
  return {
    ...newsMediaItem,
    fromDateDisplay: newsMediaItem.fromDate
      ? formatDateString(newsMediaItem.fromDate)
      : null,
    createDTDisplay: formatDateTimeString(newsMediaItem.createDT),
    lastModifyDTDisplay: formatDateTimeString(newsMediaItem.lastModifyDT),
    lastModifyUserDisplay: newsMediaItem.lastModifyUser
      ? newsMediaItem.lastModifyUser.name
      : ''
  };
};

const displayFieldNames = [
  'fromDateDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay'
];

NewsMediaItem.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default NewsMediaItem;
