import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';

function About() {
  this.barwo_tc = '';
  this.barwo_sc = '';
  this.barwo_en = '';

  this.plan_tc = '';
  this.plan_sc = '';
  this.plan_en = '';

  this.plan_gallery = [];

  this.theaterLocation_tc = '';
  this.theaterLocation_sc = '';
  this.theaterLocation_en = '';

  this.theaterDesc1_tc = '';
  this.theaterDesc1_sc = '';
  this.theaterDesc1_en = '';

  this.theaterDesc2_tc = '';
  this.theaterDesc2_sc = '';
  this.theaterDesc2_en = '';

  this.theaterTraffic_tc = '';
  this.theaterTraffic_sc = '';
  this.theaterTraffic_en = '';

  this.contactWebsite = '';
  this.contactTel = '';
  this.contactFax = '';
  this.contactEmail = '';

  this.theaterImage = '';

  this.adminTitle_tc = '';
  this.adminTitle_sc = '';
  this.adminTitle_en = '';
  this.adminName_tc = '';
  this.adminName_sc = '';
  this.adminName_en = '';

  this.lastModifyDTDisplay = null;
  this.lastModifyUserDisplay = null;
}

/* statics */

About.aboutResponseTypes = {
  // input validation

  BARWO_TC_REQUIRED: {
    type: 'BARWO_TC_REQUIRED',
    msg: 'BARWO_TC_REQUIRED'
  },
  BARWO_SC_REQUIRED: {
    type: 'BARWO_SC_REQUIRED',
    msg: 'BARWO_SC_REQUIRED'
  },
  BARWO_EN_REQUIRED: {
    type: 'BARWO_EN_REQUIRED',
    msg: 'BARWO_EN_REQUIRED'
  },

  PLAN_TC_REQUIRED: {
    type: 'PLAN_TC_REQUIRED',
    msg: 'PLAN_TC_REQUIRED'
  },
  PLAN_SC_REQUIRED: {
    type: 'PLAN_SC_REQUIRED',
    msg: 'PLAN_SC_REQUIRED'
  },
  PLAN_EN_REQUIRED: {
    type: 'PLAN_EN_REQUIRED',
    msg: 'PLAN_EN_REQUIRED'
  },

  THEATER_LOCATION_TC_REQUIRED: {
    type: 'THEATER_LOCATION_TC_REQUIRED',
    msg: 'THEATER_LOCATION_TC_REQUIRED'
  },
  THEATER_LOCATION_SC_REQUIRED: {
    type: 'THEATER_LOCATION_SC_REQUIRED',
    msg: 'THEATER_LOCATION_SC_REQUIRED'
  },
  THEATER_LOCATION_EN_REQUIRED: {
    type: 'THEATER_LOCATION_EN_REQUIRED',
    msg: 'THEATER_LOCATION_EN_REQUIRED'
  },
  THEATER_DESC1_TC_REQUIRED: {
    type: 'THEATER_DESC1_TC_REQUIRED',
    msg: 'THEATER_DESC1_TC_REQUIRED'
  },
  THEATER_DESC1_SC_REQUIRED: {
    type: 'THEATER_DESC1_SC_REQUIRED',
    msg: 'THEATER_DESC1_SC_REQUIRED'
  },
  THEATER_DESC1_EN_REQUIRED: {
    type: 'THEATER_DESC1_EN_REQUIRED',
    msg: 'THEATER_DESC1_EN_REQUIRED'
  },
  THEATER_DESC2_TC_REQUIRED: {
    type: 'THEATER_DESC2_TC_REQUIRED',
    msg: 'THEATER_DESC2_TC_REQUIRED'
  },
  THEATER_DESC2_SC_REQUIRED: {
    type: 'THEATER_DESC2_SC_REQUIRED',
    msg: 'THEATER_DESC2_SC_REQUIRED'
  },
  THEATER_DESC2_EN_REQUIRED: {
    type: 'THEATER_DESC2_EN_REQUIRED',
    msg: 'THEATER_DESC2_EN_REQUIRED'
  },
  THEATER_TRAFFIC_TC_REQUIRED: {
    type: 'THEATER_TRAFFIC_TC_REQUIRED',
    msg: 'THEATER_TRAFFIC_TC_REQUIRED'
  },
  THEATER_TRAFFIC_SC_REQUIRED: {
    type: 'THEATER_TRAFFIC_SC_REQUIRED',
    msg: 'THEATER_TRAFFIC_SC_REQUIRED'
  },
  THEATER_TRAFFIC_EN_REQUIRED: {
    type: 'THEATER_TRAFFIC_EN_REQUIRED',
    msg: 'THEATER_TRAFFIC_EN_REQUIRED'
  },
  CONTACT_WEBSITE_REQUIRED: {
    type: 'CONTACT_WEBSITE_REQUIRED',
    msg: 'CONTACT_WEBSITE_REQUIRED'
  },
  CONTACT_TEL_REQUIRED: {
    type: 'CONTACT_TEL_REQUIRED',
    msg: 'CONTACT_TEL_REQUIRED'
  },
  CONTACT_FAX_REQUIRED: {
    type: 'CONTACT_FAX_REQUIRED',
    msg: 'CONTACT_FAX_REQUIRED'
  },
  CONTACT_EMAIL_REQUIRED: {
    type: 'CONTACT_EMAIL_REQUIRED',
    msg: 'CONTACT_EMAIL_REQUIRED'
  },

  ADMIN_TITLE_TC_REQUIRED: {
    type: 'ADMIN_TITLE_TC_REQUIRED',
    msg: 'ADMIN_TITLE_TC_REQUIRED'
  },
  ADMIN_TITLE_SC_REQUIRED: {
    type: 'ADMIN_TITLE_SC_REQUIRED',
    msg: 'ADMIN_TITLE_SC_REQUIRED'
  },
  ADMIN_TITLE_EN_REQUIRED: {
    type: 'ADMIN_TITLE_EN_REQUIRED',
    msg: 'ADMIN_TITLE_EN_REQUIRED'
  },

  ADMIN_NAME_TC_REQUIRED: {
    type: 'ADMIN_NAME_TC_REQUIRED',
    msg: 'ADMIN_NAME_TC_REQUIRED'
  },
  ADMIN_NAME_SC_REQUIRED: {
    type: 'ADMIN_NAME_SC_REQUIRED',
    msg: 'ADMIN_NAME_SC_REQUIRED'
  },
  ADMIN_NAME_EN_REQUIRED: {
    type: 'ADMIN_NAME_EN_REQUIRED',
    msg: 'ADMIN_NAME_EN_REQUIRED'
  },

  // db check
  ABOUT_PAGE_NOT_EXISTS: {
    type: 'ABOUT_PAGE_NOT_EXISTS',
    msg: 'ABOUT_PAGE_NOT_EXISTS'
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

/* end of statics */

export default About;
