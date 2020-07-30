import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import { defaultMediumLinkType } from 'types/mediumLink';

const newsTypes = {
  SPECIAL_NOTICE: {
    value: 'SPECIAL_NOTICE',
    label: 'SPECIAL_NOTICE'
  },
  PRESS_RELEASE: {
    value: 'PRESS_RELEASE',
    label: 'PRESS_RELEASE'
  },
  INTERVIEW: { value: 'INTERVIEW', label: 'INTERVIEW' }
};

const defaultNewsType = newsTypes.SPECIAL_NOTICE;

function News() {
  this.label = '';
  this.order = null;
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.type = defaultNewsType.value;
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  /* media */
  this.featuredImage = null;
  this.downloadName_tc = '';
  this.downloadName_sc = '';
  this.downloadName_en = '';
  this.downloadType = defaultMediumLinkType.value;
  this.downloadUrl_tc = '';
  this.downloadUrl_sc = '';
  this.downloadUrl_en = '';
  this.downloadMedium = null;
  /* end of media */
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

News.newsesResponseTypes = {
  // input validation
  LABEL_REQUIRED: {
    type: 'LABEL_REQUIRED',
    msg: 'LABEL_REQUIRED'
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
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
  },
  TYPE_INVALID: {
    type: 'TYPE_INVALID',
    msg: 'TYPE_INVALID'
  },

  // db check
  NEWS_NOT_EXISTS: {
    type: 'NEWS_NOT_EXISTS',
    msg: 'NEWS_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

News.newsTypes = newsTypes;
News.newsTypeOptions = Object.values(newsTypes);
News.defaultNewsType = defaultNewsType;

News.getNewsForDisplay = news => {
  return {
    ...news,
    orderDisplay: Number.isInteger(news.order) ? news.order + 1 : '',
    typeDisplay: newsTypes[news.type].label,
    createDTDisplay: formatDateTimeString(news.createDT),
    lastModifyDTDisplay: formatDateTimeString(news.lastModifyDT),
    lastModifyUserDisplay: news.lastModifyUser ? news.lastModifyUser.name : '',
    isEnabledDisplay: news.isEnabled.toString()
  };
};

const displayFieldNames = [
  'orderDisplay',
  'typeDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

News.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default News;
