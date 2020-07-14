import { formatDateTimeString, formatDateString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

const activityTypes = {
  RESEARCH_AND_EDUCATION: {
    value: 'RESEARCH_AND_EDUCATION',
    label: 'RESEARCH_AND_EDUCATION'
  },
  CANTONESE_OPERA_KNOWLEDGE: {
    value: 'CANTONESE_OPERA_KNOWLEDGE',
    label: 'CANTONESE_OPERA_KNOWLEDGE'
  },
  TALK_AND_WORKSHOP: { value: 'TALK_AND_WORKSHOP', label: 'TALK_AND_WORKSHOP' },
  VIDEO_SHOW: { value: 'VIDEO_SHOW', label: 'VIDEO_SHOW' },
  SHARING: { value: 'SHARING', label: 'SHARING' },
  PAST_ACTIVITY: { value: 'PAST_ACTIVITY', label: 'PAST_ACTIVITY' }
};

function Activity() {
  this.label = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.type = activityTypes.RESEARCH_AND_EDUCATION.value;
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
  /* end of media */
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
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
  },

  // db check
  ACTIVITY_NOT_EXISTS: {
    type: 'ACTIVITY_NOT_EXISTS',
    msg: 'ACTIVITY_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Activity.activityTypes = activityTypes;
Activity.activityTypeOptions = Object.values(activityTypes);

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
