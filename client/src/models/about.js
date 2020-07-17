import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function About() {
  this.barwoDesc_tc = '';
  this.barwoDesc_sc = '';
  this.barwoDesc_en = '';

  this.planDesc_tc = '';
  this.planDesc_sc = '';
  this.planDesc_en = '';

  this.planGallery = [];

  this.theaterImage = '';

  this.theaterLocationName_tc = '';
  this.theaterLocationName_sc = '';
  this.theaterLocationName_en = '';

  this.theaterLocationDesc1_tc = '';
  this.theaterLocationDesc1_sc = '';
  this.theaterLocationDesc1_en = '';

  this.theaterLocationDesc2_tc = '';
  this.theaterLocationDesc2_sc = '';
  this.theaterLocationDesc2_en = '';

  this.theaterTraffic_tc = '';
  this.theaterTraffic_sc = '';
  this.theaterTraffic_en = '';

  this.contactWebsite = '';
  this.contactTel = '';
  this.contactFax = '';
  this.contactEmail = '';

  this.admins = [];

  this.lastModifyDTDisplay = null;
  this.lastModifyUserDisplay = null;
}

/* statics */

About.aboutResponseTypes = {
  // input validation
  BARWO_DESC_TC_REQUIRED: {
    type: 'BARWO_DESC_TC_REQUIRED',
    msg: 'BARWO_DESC_TC_REQUIRED'
  },
  BARWO_DESC_SC_REQUIRED: {
    type: 'BARWO_DESC_SC_REQUIRED',
    msg: 'BARWO_DESC_SC_REQUIRED'
  },
  BARWO_DESC_EN_REQUIRED: {
    type: 'BARWO_DESC_EN_REQUIRED',
    msg: 'BARWO_DESC_EN_REQUIRED'
  },

  PLAN_DESC_TC_REQUIRED: {
    type: 'PLAN_DESC_TC_REQUIRED',
    msg: 'PLAN_DESC_TC_REQUIRED'
  },
  PLAN_DESC_SC_REQUIRED: {
    type: 'PLAN_DESC_SC_REQUIRED',
    msg: 'PLAN_DESC_SC_REQUIRED'
  },
  PLAN_DESC_EN_REQUIRED: {
    type: 'PLAN_DESC_EN_REQUIRED',
    msg: 'PLAN_DESC_EN_REQUIRED'
  },

  THEATER_LOCATION_NAME_TC_REQUIRED: {
    type: 'THEATER_LOCATION_NAME_TC_REQUIRED',
    msg: 'THEATER_LOCATION_NAME_TC_REQUIRED'
  },
  THEATER_LOCATION_NAME_SC_REQUIRED: {
    type: 'THEATER_LOCATION_NAME_SC_REQUIRED',
    msg: 'THEATER_LOCATION_NAME_SC_REQUIRED'
  },
  THEATER_LOCATION_NAME_EN_REQUIRED: {
    type: 'THEATER_LOCATION_NAME_EN_REQUIRED',
    msg: 'THEATER_LOCATION_NAME_EN_REQUIRED'
  },
  THEATER_DESC1_TC_REQUIRED: {
    type: 'THEATER_DESC1_TC_REQUIRED',
    msg: 'THEATER_DESC1_TC_REQUIRED'
  },

  ADMIN_TITLE_TC_REQUIRED: {
    type: 'ADMIN_TITLE_TC_REQUIRED',
    msg: 'One of the admin title tc is missing.'
  },
  ADMIN_TITLE_SC_REQUIRED: {
    type: 'ADMIN_TITLE_SC_REQUIRED',
    msg: 'One of the admin title sc is missing.'
  },
  ADMIN_TITLE_EN_REQUIRED: {
    type: 'ADMIN_TITLE_EN_REQUIRED',
    msg: 'One of the admin title en is missing.'
  },

  ADMIN_NAME_TC_REQUIRED: {
    type: 'ADMIN_NAME_TC_REQUIRED',
    msg: 'One of the admin name tc is missing.'
  },
  ADMIN_NAME_SC_REQUIRED: {
    type: 'ADMIN_NAME_SC_REQUIRED',
    msg: 'One of the admin name sc is missing.'
  },
  ADMIN_NAME_EN_REQUIRED: {
    type: 'ADMIN_NAME_EN_REQUIRED',
    msg: 'One of the admin name en is missing.'
  },

  // db check
  ABOUT_NOT_EXISTS: {
    type: 'ABOUT_NOT_EXISTS',
    msg: 'ABOUT_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

About.getAboutForDisplay = about => {
  return {
    ...about,
    lastModifyDTDisplay: formatDateTimeString(about.lastModifyDT),
    lastModifyUserDisplay: about.lastModifyUser ? about.lastModifyUser.name : ''
  };
};

const displayFieldNames = ['lastModifyDTDisplay', 'lastModifyUserDisplay'];

About.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default About;
