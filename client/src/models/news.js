import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import { defaultMediumLinkType } from 'types/mediumLink';

function News() {
  this.label = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
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

News.getNewsForDisplay = news => {
  return {
    ...news,
    createDTDisplay: formatDateTimeString(news.createDT),
    lastModifyDTDisplay: formatDateTimeString(news.lastModifyDT),
    lastModifyUserDisplay: news.lastModifyUser ? news.lastModifyUser.name : '',
    isEnabledDisplay: news.isEnabled.toString()
  };
};

const displayFieldNames = [
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

News.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default News;
