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

  this.share_tc = '';
  this.share_sc = '';
  this.share_en = '';

  this.relatedShow_tc = '';
  this.relatedShow_sc = '';
  this.relatedShow_en = '';

  this.relatedArtists_tc = '';
  this.relatedArtists_sc = '';
  this.relatedArtists_en = '';

  this.relatedDrama_tc = '';
  this.relatedDrama_sc = '';
  this.relatedDrama_en = '';

  this.allShows_tc = '';
  this.allShows_sc = '';
  this.allShows_en = '';

  this.more_tc = '';
  this.more_sc = '';
  this.more_en = '';

  this.scenarist_tc = '';
  this.scenarist_sc = '';
  this.scenarist_en = '';

  this.introduction_tc = '';
  this.introduction_sc = '';
  this.introduction_en = '';

  this.buyNow_tc = '';
  this.buyNow_sc = '';
  this.buyNow_en = '';

  this.participating_tc = '';
  this.participating_sc = '';
  this.participating_en = '';

  this.role_tc = '';
  this.role_sc = '';
  this.role_en = '';

  this.studentShow_tc = '';
  this.studentShow_sc = '';
  this.studentShow_en = '';

  this.nextSchedule_tc = '';
  this.nextSchedule_sc = '';
  this.nextSchedule_en = '';

  this.leaveContact_tc = '';
  this.leaveContact_sc = '';
  this.leaveContact_en = '';

  this.publicShow_tc = '';
  this.publicShow_sc = '';
  this.publicShow_en = '';

  this.programOfShow_tc = '';
  this.programOfShow_sc = '';
  this.programOfShow_en = '';

  this.total1_tc = '';
  this.total1_sc = '';
  this.total1_en = '';

  this.total2_tc = '';
  this.total2_sc = '';
  this.total2_en = '';

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

  SHARE_TC_REQUIRED: { type: 'SHARE_TC_REQUIRED', msg: 'SHARE_TC_REQUIRED' },
  SHARE_SC_REQUIRED: { type: 'SHARE_SC_REQUIRED', msg: 'SHARE_SC_REQUIRED' },
  SHARE_EN_REQUIRED: { type: 'SHARE_EN_REQUIRED', msg: 'SHARE_EN_REQUIRED' },

  RELATEDSHOW_TC_REQUIRED: {
    type: 'RELATEDSHOW_TC_REQUIRED',
    msg: 'RELATEDSHOW_TC_REQUIRED'
  },
  RELATEDSHOW_SC_REQUIRED: {
    type: 'RELATEDSHOW_SC_REQUIRED',
    msg: 'RELATEDSHOW_SC_REQUIRED'
  },
  RELATEDSHOW_EN_REQUIRED: {
    type: 'RELATEDSHOW_EN_REQUIRED',
    msg: 'RELATEDSHOW_EN_REQUIRED'
  },

  RELATEDARTISTS_TC_REQUIRED: {
    type: 'RELATEDARTISTS_TC_REQUIRED',
    msg: 'RELATEDARTISTS_TC_REQUIRED'
  },
  RELATEDARTISTS_SC_REQUIRED: {
    type: 'RELATEDARTISTS_SC_REQUIRED',
    msg: 'RELATEDARTISTS_SC_REQUIRED'
  },
  RELATEDARTISTS_EN_REQUIRED: {
    type: 'RELATEDARTISTS_EN_REQUIRED',
    msg: 'RELATEDARTISTS_EN_REQUIRED'
  },

  RELATEDDRAMA_TC_REQUIRED: {
    type: 'RELATEDDRAMA_TC_REQUIRED',
    msg: 'RELATEDDRAMA_TC_REQUIRED'
  },
  RELATEDDRAMA_SC_REQUIRED: {
    type: 'RELATEDDRAMA_SC_REQUIRED',
    msg: 'RELATEDDRAMA_SC_REQUIRED'
  },
  RELATEDDRAMA_EN_REQUIRED: {
    type: 'RELATEDDRAMA_EN_REQUIRED',
    msg: 'RELATEDDRAMA_EN_REQUIRED'
  },

  ALLSHOWS_TC_REQUIRED: {
    type: 'ALLSHOWS_TC_REQUIRED',
    msg: 'ALLSHOWS_TC_REQUIRED'
  },
  ALLSHOWS_SC_REQUIRED: {
    type: 'ALLSHOWS_SC_REQUIRED',
    msg: 'ALLSHOWS_SC_REQUIRED'
  },
  ALLSHOWS_EN_REQUIRED: {
    type: 'ALLSHOWS_EN_REQUIRED',
    msg: 'ALLSHOWS_EN_REQUIRED'
  },

  MORE_TC_REQUIRED: { type: 'MORE_TC_REQUIRED', msg: 'MORE_TC_REQUIRED' },
  MORE_SC_REQUIRED: { type: 'MORE_SC_REQUIRED', msg: 'MORE_SC_REQUIRED' },
  MORE_EN_REQUIRED: { type: 'MORE_EN_REQUIRED', msg: 'MORE_EN_REQUIRED' },

  SCENARIST_TC_REQUIRED: {
    type: 'SCENARIST_TC_REQUIRED',
    msg: 'SCENARIST_TC_REQUIRED'
  },
  SCENARIST_SC_REQUIRED: {
    type: 'SCENARIST_SC_REQUIRED',
    msg: 'SCENARIST_SC_REQUIRED'
  },
  SCENARIST_EN_REQUIRED: {
    type: 'SCENARIST_EN_REQUIRED',
    msg: 'SCENARIST_EN_REQUIRED'
  },

  INTRODUCTION_TC_REQUIRED: {
    type: 'INTRODUCTION_TC_REQUIRED',
    msg: 'INTRODUCTION_TC_REQUIRED'
  },
  INTRODUCTION_SC_REQUIRED: {
    type: 'INTRODUCTION_SC_REQUIRED',
    msg: 'INTRODUCTION_SC_REQUIRED'
  },
  INTRODUCTION_EN_REQUIRED: {
    type: 'INTRODUCTION_EN_REQUIRED',
    msg: 'INTRODUCTION_EN_REQUIRED'
  },

  BUYNOW_TC_REQUIRED: { type: 'BUYNOW_TC_REQUIRED', msg: 'BUYNOW_TC_REQUIRED' },
  BUYNOW_SC_REQUIRED: { type: 'BUYNOW_SC_REQUIRED', msg: 'BUYNOW_SC_REQUIRED' },
  BUYNOW_EN_REQUIRED: { type: 'BUYNOW_EN_REQUIRED', msg: 'BUYNOW_EN_REQUIRED' },

  PARTICIPATING_TC_REQUIRED: {
    type: 'PARTICIPATING_TC_REQUIRED',
    msg: 'PARTICIPATING_TC_REQUIRED'
  },
  PARTICIPATING_SC_REQUIRED: {
    type: 'PARTICIPATING_SC_REQUIRED',
    msg: 'PARTICIPATING_SC_REQUIRED'
  },
  PARTICIPATING_EN_REQUIRED: {
    type: 'PARTICIPATING_EN_REQUIRED',
    msg: 'PARTICIPATING_EN_REQUIRED'
  },

  ROLE_TC_REQUIRED: { type: 'ROLE_TC_REQUIRED', msg: 'ROLE_TC_REQUIRED' },
  ROLE_SC_REQUIRED: { type: 'ROLE_SC_REQUIRED', msg: 'ROLE_SC_REQUIRED' },
  ROLE_EN_REQUIRED: { type: 'ROLE_EN_REQUIRED', msg: 'ROLE_EN_REQUIRED' },

  STUDENTSHOW_TC_REQUIRED: {
    type: 'STUDENTSHOW_TC_REQUIRED',
    msg: 'STUDENTSHOW_TC_REQUIRED'
  },
  STUDENTSHOW_SC_REQUIRED: {
    type: 'STUDENTSHOW_SC_REQUIRED',
    msg: 'STUDENTSHOW_SC_REQUIRED'
  },
  STUDENTSHOW_EN_REQUIRED: {
    type: 'STUDENTSHOW_EN_REQUIRED',
    msg: 'STUDENTSHOW_EN_REQUIRED'
  },

  NEXTSCHEDULE_TC_REQUIRED: {
    type: 'NEXTSCHEDULE_TC_REQUIRED',
    msg: 'NEXTSCHEDULE_TC_REQUIRED'
  },
  NEXTSCHEDULE_SC_REQUIRED: {
    type: 'NEXTSCHEDULE_SC_REQUIRED',
    msg: 'NEXTSCHEDULE_SC_REQUIRED'
  },
  NEXTSCHEDULE_EN_REQUIRED: {
    type: 'NEXTSCHEDULE_EN_REQUIRED',
    msg: 'NEXTSCHEDULE_EN_REQUIRED'
  },

  LEAVECONTACT_TC_REQUIRED: {
    type: 'LEAVECONTACT_TC_REQUIRED',
    msg: 'LEAVECONTACT_TC_REQUIRED'
  },
  LEAVECONTACT_SC_REQUIRED: {
    type: 'LEAVECONTACT_SC_REQUIRED',
    msg: 'LEAVECONTACT_SC_REQUIRED'
  },
  LEAVECONTACT_EN_REQUIRED: {
    type: 'LEAVECONTACT_EN_REQUIRED',
    msg: 'LEAVECONTACT_EN_REQUIRED'
  },

  PUBLICSHOW_TC_REQUIRED: {
    type: 'PUBLICSHOW_TC_REQUIRED',
    msg: 'PUBLICSHOW_TC_REQUIRED'
  },
  PUBLICSHOW_SC_REQUIRED: {
    type: 'PUBLICSHOW_SC_REQUIRED',
    msg: 'PUBLICSHOW_SC_REQUIRED'
  },
  PUBLICSHOW_EN_REQUIRED: {
    type: 'PUBLICSHOW_EN_REQUIRED',
    msg: 'PUBLICSHOW_EN_REQUIRED'
  },

  PROGRAMOFSHOW_TC_REQUIRED: {
    type: 'PROGRAMOFSHOW_TC_REQUIRED',
    msg: 'PROGRAMOFSHOW_TC_REQUIRED'
  },
  PROGRAMOFSHOW_SC_REQUIRED: {
    type: 'PROGRAMOFSHOW_SC_REQUIRED',
    msg: 'PROGRAMOFSHOW_SC_REQUIRED'
  },
  PROGRAMOFSHOW_EN_REQUIRED: {
    type: 'PROGRAMOFSHOW_EN_REQUIRED',
    msg: 'PROGRAMOFSHOW_EN_REQUIRED'
  },

  TOTAL1_TC_REQUIRED: {
    type: 'TOTAL1_TC_REQUIRED',
    msg: 'TOTAL1_TC_REQUIRED'
  },
  TOTAL1_SC_REQUIRED: {
    type: 'TOTAL1_SC_REQUIRED',
    msg: 'TOTAL1_SC_REQUIRED'
  },
  TOTAL1_EN_REQUIRED: {
    type: 'TOTAL1_EN_REQUIRED',
    msg: 'TOTAL1_EN_REQUIRED'
  },

  TOTAL2_TC_REQUIRED: {
    type: 'TOTAL2_TC_REQUIRED',
    msg: 'TOTAL2_TC_REQUIRED'
  },
  TOTAL2_SC_REQUIRED: {
    type: 'TOTAL2_SC_REQUIRED',
    msg: 'TOTAL2_SC_REQUIRED'
  },
  TOTAL2_EN_REQUIRED: {
    type: 'TOTAL2_EN_REQUIRED',
    msg: 'TOTAL2_EN_REQUIRED'
  },

  // db check
  GLOBAL_CONSTANTS_NOT_EXISTS: {
    type: 'GLOBAL_CONSTANTS_NOT_EXISTS',
    msg: 'GLOBAL_CONSTANTS_NOT_EXISTS'
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
