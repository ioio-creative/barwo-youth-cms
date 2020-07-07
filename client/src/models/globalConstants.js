import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';

function GlobalConstants() {
  this.latestShow_tc = '';
  this.latestShow_sc = '';
  this.latestShow_en = '';

  this.scheduleOfShow_tc = '';
  this.scheduleOfShow_sc = '';
  this.scheduleOfShow_en = '';

  this.artDirector_tc = '';
  this.artDirector_sc = '';
  this.artDirector_en = '';

  this.actor_tc = '';
  this.actor_sc = '';
  this.actor_en = '';

  this.detailsOfShow_tc = '';
  this.detailsOfShow_sc = '';
  this.detailsOfShow_en = '';

  this.show_tc = '';
  this.show_sc = '';
  this.show_en = '';

  this.allShow_tc = '';
  this.allShow_sc = '';
  this.allShow_en = '';

  this.activities_tc = '';
  this.activities_sc = '';
  this.activities_en = '';

  this.downloadPDF_tc = '';
  this.downloadPDF_sc = '';
  this.downloadPDF_en = '';

  this.ourActors_tc = '';
  this.ourActors_sc = '';
  this.ourActors_en = '';

  this.ymtTheater_tc = '';
  this.ymtTheater_sc = '';
  this.ymtTheater_en = '';

  this.followUs_tc = '';
  this.followUs_sc = '';
  this.followUs_en = '';

  this.all_tc = '';
  this.all_sc = '';
  this.all_en = '';

  this.boy_tc = '';
  this.boy_sc = '';
  this.boy_en = '';

  this.girl_tc = '';
  this.girl_sc = '';
  this.girl_en = '';

  this.inherit_tc = '';
  this.inherit_sc = '';
  this.inherit_en = '';
  this.lastModifyDTDisplay = null;
  this.lastModifyUserDisplay = null;
}

/* statics */

GlobalConstants.globalConstantsResponseTypes = {
  // input validation

  LATESTSHOW_TC_REQUIRED: {
    type: 'LATESTSHOW_TC_REQUIRED',
    msg: 'LATESTSHOW_TC_REQUIRED'
  },
  LATESTSHOW_SC_REQUIRED: {
    type: 'LATESTSHOW_SC_REQUIRED',
    msg: 'LATESTSHOW_SC_REQUIRED'
  },
  LATESTSHOW_EN_REQUIRED: {
    type: 'LATESTSHOW_EN_REQUIRED',
    msg: 'LATESTSHOW_EN_REQUIRED'
  },

  SCHEDULEOFSHOW_TC_REQUIRED: {
    type: 'SCHEDULEOFSHOW_TC_REQUIRED',
    msg: 'SCHEDULEOFSHOW_TC_REQUIRED'
  },
  SCHEDULEOFSHOW_SC_REQUIRED: {
    type: 'SCHEDULEOFSHOW_SC_REQUIRED',
    msg: 'SCHEDULEOFSHOW_SC_REQUIRED'
  },
  SCHEDULEOFSHOW_EN_REQUIRED: {
    type: 'SCHEDULEOFSHOW_EN_REQUIRED',
    msg: 'SCHEDULEOFSHOW_EN_REQUIRED'
  },

  ARTDIRECTOR_TC_REQUIRED: {
    type: 'ARTDIRECTOR_TC_REQUIRED',
    msg: 'ARTDIRECTOR_TC_REQUIRED'
  },
  ARTDIRECTOR_SC_REQUIRED: {
    type: 'ARTDIRECTOR_SC_REQUIRED',
    msg: 'ARTDIRECTOR_SC_REQUIRED'
  },
  ARTDIRECTOR_EN_REQUIRED: {
    type: 'ARTDIRECTOR_EN_REQUIRED',
    msg: 'ARTDIRECTOR_EN_REQUIRED'
  },

  ACTOR_TC_REQUIRED: {
    type: 'ACTOR_TC_REQUIRED',
    msg: 'ACTOR_TC_REQUIRED'
  },
  ACTOR_SC_REQUIRED: {
    type: 'ACTOR_SC_REQUIRED',
    msg: 'ACTOR_SC_REQUIRED'
  },
  ACTOR_EN_REQUIRED: {
    type: 'ACTOR_EN_REQUIRED',
    msg: 'ACTOR_EN_REQUIRED'
  },

  DETAILSOFSHOW_TC_REQUIRED: {
    type: 'DETAILSOFSHOW_TC_REQUIRED',
    msg: 'DETAILSOFSHOW_TC_REQUIRED'
  },
  DETAILSOFSHOW_SC_REQUIRED: {
    type: 'DETAILSOFSHOW_SC_REQUIRED',
    msg: 'DETAILSOFSHOW_SC_REQUIRED'
  },
  DETAILSOFSHOW_EN_REQUIRED: {
    type: 'DETAILSOFSHOW_EN_REQUIRED',
    msg: 'DETAILSOFSHOW_EN_REQUIRED'
  },

  SHOW_TC_REQUIRED: {
    type: 'SHOW_TC_REQUIRED',
    msg: 'SHOW_TC_REQUIRED'
  },
  SHOW_SC_REQUIRED: {
    type: 'SHOW_SC_REQUIRED',
    msg: 'SHOW_SC_REQUIRED'
  },
  SHOW_EN_REQUIRED: {
    type: 'SHOW_EN_REQUIRED',
    msg: 'SHOW_EN_REQUIRED'
  },

  ALLSHOW_TC_REQUIRED: {
    type: 'ALLSHOW_TC_REQUIRED',
    msg: 'ALLSHOW_TC_REQUIRED'
  },
  ALLSHOW_SC_REQUIRED: {
    type: 'ALLSHOW_SC_REQUIRED',
    msg: 'ALLSHOW_SC_REQUIRED'
  },
  ALLSHOW_EN_REQUIRED: {
    type: 'ALLSHOW_EN_REQUIRED',
    msg: 'ALLSHOW_EN_REQUIRED'
  },

  ACTIVITIES_TC_REQUIRED: {
    type: 'ACTIVITIES_TC_REQUIRED',
    msg: 'ACTIVITIES_TC_REQUIRED'
  },
  ACTIVITIES_SC_REQUIRED: {
    type: 'ACTIVITIES_SC_REQUIRED',
    msg: 'ACTIVITIES_SC_REQUIRED'
  },
  ACTIVITIES_EN_REQUIRED: {
    type: 'ACTIVITIES_EN_REQUIRED',
    msg: 'ACTIVITIES_EN_REQUIRED'
  },

  DOWNLOADPDF_TC_REQUIRED: {
    type: 'DOWNLOADPDF_TC_REQUIRED',
    msg: 'DOWNLOADPDF_TC_REQUIRED'
  },
  DOWNLOADPDF_SC_REQUIRED: {
    type: 'DOWNLOADPDF_SC_REQUIRED',
    msg: 'DOWNLOADPDF_SC_REQUIRED'
  },
  DOWNLOADPDF_EN_REQUIRED: {
    type: 'DOWNLOADPDF_EN_REQUIRED',
    msg: 'DOWNLOADPDF_EN_REQUIRED'
  },

  YMTTHEATER_TC_REQUIRED: {
    type: 'YMTTHEATER_TC_REQUIRED',
    msg: 'YMTTHEATER_TC_REQUIRED'
  },
  YMTTHEATER_SC_REQUIRED: {
    type: 'YMTTHEATER_SC_REQUIRED',
    msg: 'YMTTHEATER_SC_REQUIRED'
  },
  YMTTHEATER_EN_REQUIRED: {
    type: 'YMTTHEATER_EN_REQUIRED',
    msg: 'YMTTHEATER_EN_REQUIRED'
  },

  FOLLOWUS_TC_REQUIRED: {
    type: 'FOLLOWUS_TC_REQUIRED',
    msg: 'FOLLOWUS_TC_REQUIRED'
  },
  FOLLOWUS_SC_REQUIRED: {
    type: 'FOLLOWUS_SC_REQUIRED',
    msg: 'FOLLOWUS_SC_REQUIRED'
  },
  FOLLOWUS_EN_REQUIRED: {
    type: 'FOLLOWUS_EN_REQUIRED',
    msg: 'FOLLOWUS_EN_REQUIRED'
  },

  ALL_TC_REQUIRED: {
    type: 'ALL_TC_REQUIRED',
    msg: 'ALL_TC_REQUIRED'
  },
  ALL_SC_REQUIRED: {
    type: 'ALL_SC_REQUIRED',
    msg: 'ALL_SC_REQUIRED'
  },
  ALL_EN_REQUIRED: {
    type: 'ALL_EN_REQUIRED',
    msg: 'ALL_EN_REQUIRED'
  },

  BOY_TC_REQUIRED: {
    type: 'BOY_TC_REQUIRED',
    msg: 'BOY_TC_REQUIRED'
  },
  BOY_SC_REQUIRED: {
    type: 'BOY_SC_REQUIRED',
    msg: 'BOY_SC_REQUIRED'
  },
  BOY_EN_REQUIRED: {
    type: 'BOY_EN_REQUIRED',
    msg: 'BOY_EN_REQUIRED'
  },

  GIRL_TC_REQUIRED: {
    type: 'GIRL_TC_REQUIRED',
    msg: 'GIRL_TC_REQUIRED'
  },
  GIRL_SC_REQUIRED: {
    type: 'GIRL_SC_REQUIRED',
    msg: 'GIRL_SC_REQUIRED'
  },
  GIRL_EN_REQUIRED: {
    type: 'GIRL_EN_REQUIRED',
    msg: 'GIRL_EN_REQUIRED'
  },

  INHERIT_TC_REQUIRED: {
    type: 'INHERIT_TC_REQUIRED',
    msg: 'INHERIT_TC_REQUIRED'
  },
  INHERIT_SC_REQUIRED: {
    type: 'INHERIT_SC_REQUIRED',
    msg: 'INHERIT_SC_REQUIRED'
  },
  INHERIT_EN_REQUIRED: {
    type: 'INHERIT_EN_REQUIRED',
    msg: 'INHERIT_EN_REQUIRED'
  },

  // db check
  GLOBAL_CONSTANTS_PAGE_NOT_EXISTS: {
    type: 'GLOBAL_CONSTANTS_PAGE_NOT_EXISTS',
    msg: 'GLOBAL_CONSTANTS_PAGE_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

GlobalConstants.getGlobalConstantsForDisplay = globalConstants => {
  return {
    ...globalConstants,
    lastModifyDTDisplay: formatDateTimeString(globalConstants.lastModifyDT),
    lastModifyUserDisplay: globalConstants.lastModifyUser
      ? globalConstants.lastModifyUser.name
      : ''
  };
};

/* end of statics */

export default GlobalConstants;
