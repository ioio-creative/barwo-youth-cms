import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import firstOrDefault from 'utils/js/array/firstOrDefault';

function NewsMediaGroup() {
  this.label = '';
  this.order = null;
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.year = new Date().getFullYear();
  this.newsMediaItems = [];
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

NewsMediaGroup.newsMediaGroupsResponseTypes = {
  // input validation
  LABEL_REQUIRED: { type: 'LABEL_REQUIRED', msg: 'LABEL_REQUIRED' },
  NAME_TC_REQUIRED: { type: 'NAME_TC_REQUIRED', msg: 'NAME_TC_REQUIRED' },
  NAME_SC_REQUIRED: { type: 'NAME_SC_REQUIRED', msg: 'NAME_SC_REQUIRED' },
  NAME_EN_REQUIRED: { type: 'NAME_EN_REQUIRED', msg: 'NAME_EN_REQUIRED' },
  YEAR_REQUIRED: { type: 'YEAR_REQUIRED', msg: 'YEAR_REQUIRED' },

  // db check
  NEWS_MEDIA_GROUP_NOT_EXISTS: {
    type: 'NEWS_MEDIA_GROUP_NOT_EXISTS',
    msg: 'NEWS_MEDIA_GROUP_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

NewsMediaGroup.yearOptions = range(2015, 2040).map(year => {
  return {
    value: year,
    label: year.toString()
  };
});

NewsMediaGroup.getNewsMediaGroupForDisplay = newsMediaGroup => {
  return {
    ...newsMediaGroup,
    orderDisplay: Number.isInteger(newsMediaGroup.order)
      ? newsMediaGroup.order + 1
      : '',
    yearDisplay: newsMediaGroup.year.toString(),
    newsMediaItemsDisplay: firstOrDefault(newsMediaGroup.newsMediaItems, {
      label: ''
    }).label,
    createDTDisplay: formatDateTimeString(newsMediaGroup.createDT),
    lastModifyDTDisplay: formatDateTimeString(newsMediaGroup.lastModifyDT),
    lastModifyUserDisplay: newsMediaGroup.lastModifyUser
      ? newsMediaGroup.lastModifyUser.name
      : '',
    isEnabledDisplay: newsMediaGroup.isEnabled.toString()
  };
};

const displayFieldNames = [
  'orderDisplay',
  'yearDisplay',
  'newsMediaItemsDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

NewsMediaGroup.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default NewsMediaGroup;
