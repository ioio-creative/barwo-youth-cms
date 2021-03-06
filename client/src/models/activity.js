import { formatDateTimeString, formatDateString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
//import { defaultMediumLinkType } from 'types/mediumLink';

const activityTypes = {
  GUIDED_TALK: {
    value: 'GUIDED_TALK',
    label: 'GUIDED_TALK'
  },
  YOUTH_PROGRAMME: {
    value: 'YOUTH_PROGRAMME',
    label: 'YOUTH_PROGRAMME'
  },
  CANTONESE_OPERA_KNOWLEDGE: {
    value: 'CANTONESE_OPERA_KNOWLEDGE',
    label: 'CANTONESE_OPERA_KNOWLEDGE'
  },
  COMMUNITY_PERFORMANCE: {
    value: 'COMMUNITY_PERFORMANCE',
    label: 'COMMUNITY_PERFORMANCE'
  },
  //COLLEGE_SHOW: { value: 'COLLEGE_SHOW', label: 'COLLEGE_SHOW' },
  EXHIBITION: {
    value: 'EXHIBITION',
    label: 'EXHIBITION'
  }
};

const defaultActivityType = activityTypes.GUIDED_TALK;

function Activity() {
  this.label = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.nameForLongDisplay_tc = '';
  this.nameForLongDisplay_sc = '';
  this.nameForLongDisplay_en = '';
  this.type = defaultActivityType.value;
  this.fromDate = null;
  this.toDate = null;
  this.location_tc = '';
  this.location_sc = '';
  this.location_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  /* media */
  this.featuredImage = null;
  this.gallery = [];
  this.videoLinks = [];
  // this.downloadName_tc = '';
  // this.downloadName_sc = '';
  // this.downloadName_en = '';
  // this.downloadType = defaultMediumLinkType.value;
  // this.downloadUrl_tc = '';
  // this.downloadUrl_sc = '';
  // this.downloadUrl_en = '';
  // this.downloadMedium = null;
  /* end of media */
  this.pageMeta = null;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Activity.activitiesResponseTypes = {
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
  NAME_FOR_LONG_DISPLAY_TC_REQUIRED: {
    type: 'NAME_FOR_LONG_DISPLAY_TC_REQUIRED',
    msg: 'NAME_FOR_LONG_DISPLAY_TC_REQUIRED'
  },
  NAME_FOR_LONG_DISPLAY_SC_REQUIRED: {
    type: 'NAME_FOR_LONG_DISPLAY_SC_REQUIRED',
    msg: 'NAME_FOR_LONG_DISPLAY_SC_REQUIRED'
  },
  NAME_FOR_LONG_DISPLAY_EN_REQUIRED: {
    type: 'NAME_FOR_LONG_DISPLAY_EN_REQUIRED',
    msg: 'NAME_FOR_LONG_DISPLAY_EN_REQUIRED'
  },
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
  },
  FROM_DATE_REQUIRED: {
    type: 'FROM_DATE_REQUIRED',
    msg: 'FROM_DATE_REQUIRED'
  },
  VIDEO_LINK_REQUIRED: 'VIDEO_LINK_REQUIRED',

  // db check
  ACTIVITY_NOT_EXISTS: {
    type: 'ACTIVITY_NOT_EXISTS',
    msg: 'ACTIVITY_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },
  ACTIVITY_FEATURED_IN_LANDING: {
    type: 'ACTIVITY_FEATURED_IN_LANDING',
    msg: 'ACTIVITY_FEATURED_IN_LANDING'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Activity.activityTypes = activityTypes;
Activity.activityTypeOptions = Object.values(activityTypes);
Activity.defaultActivityType = defaultActivityType;

Activity.getActivityForDisplay = activity => {
  return {
    ...activity,
    typeDisplay: activityTypes[activity.type].label,
    fromDateDisplay: activity.fromDate
      ? formatDateString(activity.fromDate)
      : null,
    toDateDisplay: activity.toDate ? formatDateString(activity.toDate) : null,
    createDTDisplay: formatDateTimeString(activity.createDT),
    lastModifyDTDisplay: formatDateTimeString(activity.lastModifyDT),
    lastModifyUserDisplay: activity.lastModifyUser
      ? activity.lastModifyUser.name
      : '',
    isEnabledDisplay: activity.isEnabled.toString()
  };
};

const displayFieldNames = [
  'typeDisplay',
  'fromDateDisplay',
  'toDateDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Activity.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Activity;
