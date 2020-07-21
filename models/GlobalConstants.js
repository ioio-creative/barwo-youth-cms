const mongoose = require('mongoose');

const GlobalConstantsSchema = mongoose.Schema({
  latestShow_tc: {
    type: String,
    require: true
  },
  latestShow_sc: {
    type: String,
    require: true
  },
  latestShow_en: {
    type: String,
    require: true
  },

  scheduleOfShow_tc: {
    type: String,
    require: true
  },
  scheduleOfShow_sc: {
    type: String,
    require: true
  },
  scheduleOfShow_en: {
    type: String,
    require: true
  },

  artDirector_tc: {
    type: String,
    require: true
  },
  artDirector_sc: {
    type: String,
    require: true
  },
  artDirector_en: {
    type: String,
    require: true
  },

  actor_tc: {
    type: String,
    require: true
  },
  actor_sc: {
    type: String,
    require: true
  },
  actor_en: {
    type: String,
    require: true
  },

  detailsOfShow_tc: {
    type: String,
    require: true
  },
  detailsOfShow_sc: {
    type: String,
    require: true
  },
  detailsOfShow_en: {
    type: String,
    require: true
  },

  show_tc: {
    type: String,
    require: true
  },
  show_sc: {
    type: String,
    require: true
  },
  show_en: {
    type: String,
    require: true
  },

  allShow_tc: {
    type: String,
    require: true
  },
  allShow_sc: {
    type: String,
    require: true
  },
  allShow_en: {
    type: String,
    require: true
  },

  activities_tc: {
    type: String,
    require: true
  },
  activities_sc: {
    type: String,
    require: true
  },
  activities_en: {
    type: String,
    require: true
  },

  downloadPDF_tc: {
    type: String,
    require: true
  },
  downloadPDF_sc: {
    type: String,
    require: true
  },
  downloadPDF_en: {
    type: String,
    require: true
  },

  ourActors_tc: {
    type: String,
    require: true
  },
  ourActors_sc: {
    type: String,
    require: true
  },
  ourActors_en: {
    type: String,
    require: true
  },

  ymtTheater_tc: {
    type: String,
    require: true
  },
  ymtTheater_sc: {
    type: String,
    require: true
  },
  ymtTheater_en: {
    type: String,
    require: true
  },

  followUs_tc: {
    type: String,
    require: true
  },
  followUs_sc: {
    type: String,
    require: true
  },
  followUs_en: {
    type: String,
    require: true
  },

  all_tc: {
    type: String,
    require: true
  },
  all_sc: {
    type: String,
    require: true
  },
  all_en: {
    type: String,
    require: true
  },

  boy_tc: {
    type: String,
    require: true
  },
  boy_sc: {
    type: String,
    require: true
  },
  boy_en: {
    type: String,
    require: true
  },

  girl_tc: {
    type: String,
    require: true
  },
  girl_sc: {
    type: String,
    require: true
  },
  girl_en: {
    type: String,
    require: true
  },

  inherit_tc: {
    type: String,
    require: true
  },
  inherit_sc: {
    type: String,
    require: true
  },
  inherit_en: {
    type: String,
    require: true
  },

  share_tc: {
    type: String,
    require: true
  },
  share_sc: {
    type: String,
    require: true
  },
  share_en: {
    type: String,
    require: true
  },

  relatedShow_tc: {
    type: String,
    require: true
  },
  relatedShow_sc: {
    type: String,
    require: true
  },
  relatedShow_en: {
    type: String,
    require: true
  },

  relatedArtists_tc: {
    type: String,
    require: true
  },
  relatedArtists_sc: {
    type: String,
    require: true
  },
  relatedArtists_en: {
    type: String,
    require: true
  },

  relatedDrama_tc: {
    type: String,
    require: true
  },
  relatedDrama_sc: {
    type: String,
    require: true
  },
  relatedDrama_en: {
    type: String,
    require: true
  },

  allShows_tc: {
    type: String,
    require: true
  },
  allShows_sc: {
    type: String,
    require: true
  },
  allShows_en: {
    type: String,
    require: true
  },

  more_tc: {
    type: String,
    require: true
  },
  more_sc: {
    type: String,
    require: true
  },
  more_en: {
    type: String,
    require: true
  },

  scenarist_tc: {
    type: String,
    require: true
  },
  scenarist_sc: {
    type: String,
    require: true
  },
  scenarist_en: {
    type: String,
    require: true
  },

  introduction_tc: {
    type: String,
    require: true
  },
  introduction_sc: {
    type: String,
    require: true
  },
  introduction_en: {
    type: String,
    require: true
  },

  buyNow_tc: {
    type: String,
    require: true
  },
  buyNow_sc: {
    type: String,
    require: true
  },
  buyNow_en: {
    type: String,
    require: true
  },

  participating_tc: {
    type: String,
    require: true
  },
  participating_sc: {
    type: String,
    require: true
  },
  participating_en: {
    type: String,
    require: true
  },

  role_tc: {
    type: String,
    require: true
  },
  role_sc: {
    type: String,
    require: true
  },
  role_en: {
    type: String,
    require: true
  },

  studentShow_tc: {
    type: String,
    require: true
  },
  studentShow_sc: {
    type: String,
    require: true
  },
  studentShow_en: {
    type: String,
    require: true
  },

  nextSchedule_tc: {
    type: String,
    require: true
  },
  nextSchedule_sc: {
    type: String,
    require: true
  },
  nextSchedule_en: {
    type: String,
    require: true
  },

  leaveContact_tc: {
    type: String,
    require: true
  },
  leaveContact_sc: {
    type: String,
    require: true
  },
  leaveContact_en: {
    type: String,
    require: true
  },

  publicShow_tc: {
    type: String,
    require: true
  },
  publicShow_sc: {
    type: String,
    require: true
  },
  publicShow_en: {
    type: String,
    require: true
  },

  programOfShow_tc: {
    type: String,
    require: true
  },
  programOfShow_sc: {
    type: String,
    require: true
  },
  programOfShow_en: {
    type: String,
    require: true
  },

  total1_tc: {
    type: String,
    require: true
  },
  total1_sc: {
    type: String,
    require: true
  },
  total1_en: {
    type: String,
    require: true
  },

  total2_tc: {
    type: String,
    require: true
  },
  total2_sc: {
    type: String,
    require: true
  },
  total2_en: {
    type: String,
    require: true
  },

  about_tc: {
    type: String,
    require: true
  },
  about_sc: {
    type: String,
    require: true
  },
  about_en: {
    type: String,
    require: true
  },

  map_tc: {
    type: String,
    require: true
  },
  map_sc: {
    type: String,
    require: true
  },
  map_en: {
    type: String,
    require: true
  },

  traffic_tc: {
    type: String,
    require: true
  },
  traffic_sc: {
    type: String,
    require: true
  },
  traffic_en: {
    type: String,
    require: true
  },

  contact_tc: {
    type: String,
    require: true
  },
  contact_sc: {
    type: String,
    require: true
  },
  contact_en: {
    type: String,
    require: true
  },

  website_tc: {
    type: String,
    require: true
  },
  website_sc: {
    type: String,
    require: true
  },
  website_en: {
    type: String,
    require: true
  },

  tel_tc: {
    type: String,
    require: true
  },
  tel_sc: {
    type: String,
    require: true
  },
  tel_en: {
    type: String,
    require: true
  },

  fax_tc: {
    type: String,
    require: true
  },
  fax_sc: {
    type: String,
    require: true
  },
  fax_en: {
    type: String,
    require: true
  },

  email_tc: {
    type: String,
    require: true
  },
  email_sc: {
    type: String,
    require: true
  },
  email_en: {
    type: String,
    require: true
  },

  RESEARCH_AND_EDUCATION_tc: {
    type: String,
    require: true
  },
  RESEARCH_AND_EDUCATION_sc: {
    type: String,
    require: true
  },
  RESEARCH_AND_EDUCATION_en: {
    type: String,
    require: true
  },

  knowledge_tc: {
    type: String,
    require: true
  },
  knowledge_sc: {
    type: String,
    require: true
  },
  knowledge_en: {
    type: String,
    require: true
  },

  workshop_tc: {
    type: String,
    require: true
  },
  workshop_sc: {
    type: String,
    require: true
  },
  workshop_en: {
    type: String,
    require: true
  },

  video_show_tc: {
    type: String,
    require: true
  },
  video_show_sc: {
    type: String,
    require: true
  },
  video_show_en: {
    type: String,
    require: true
  },

  sharing_tc: {
    type: String,
    require: true
  },
  sharing_sc: {
    type: String,
    require: true
  },
  sharing_en: {
    type: String,
    require: true
  },

  past_activity_tc: {
    type: String,
    require: true
  },
  past_activity_sc: {
    type: String,
    require: true
  },
  past_activity_en: {
    type: String,
    require: true
  },

  details_tc: {
    type: String,
    require: true
  },
  details_sc: {
    type: String,
    require: true
  },
  details_en: {
    type: String,
    require: true
  },

  dateOfShow_tc: {
    type: String,
    require: true
  },
  dateOfShow_sc: {
    type: String,
    require: true
  },
  dateOfShow_en: {
    type: String,
    require: true
  },

  location_tc: {
    type: String,
    require: true
  },
  location_sc: {
    type: String,
    require: true
  },
  location_en: {
    type: String,
    require: true
  },

  relatedNews_tc: {
    type: String,
    require: true
  },
  relatedNews_sc: {
    type: String,
    require: true
  },
  relatedNews_en: {
    type: String,
    require: true
  },

  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.GlobalConstants = mongoose.model(
  'GlobalConstants',
  GlobalConstantsSchema
);

module.exports.globalConstantsResponseTypes = {
  // input validation
  LATESTSHOW_TC_REQUIRED: 'LATESTSHOW_TC_REQUIRED',
  LATESTSHOW_SC_REQUIRED: 'LATESTSHOW_SC_REQUIRED',
  LATESTSHOW_EN_REQUIRED: 'LATESTSHOW_EN_REQUIRED',

  SCHEDULEOFSHOW_TC_REQUIRED: 'SCHEDULEOFSHOW_TC_REQUIRED',
  SCHEDULEOFSHOW_SC_REQUIRED: 'SCHEDULEOFSHOW_SC_REQUIRED',
  SCHEDULEOFSHOW_EN_REQUIRED: 'SCHEDULEOFSHOW_EN_REQUIRED',

  ARTDIRECTOR_TC_REQUIRED: 'ARTDIRECTOR_TC_REQUIRED',
  ARTDIRECTOR_SC_REQUIRED: 'ARTDIRECTOR_SC_REQUIRED',
  ARTDIRECTOR_EN_REQUIRED: 'ARTDIRECTOR_EN_REQUIRED',

  ACTOR_TC_REQUIRED: 'ACTOR_TC_REQUIRED',
  ACTOR_SC_REQUIRED: 'ACTOR_SC_REQUIRED',
  ACTOR_EN_REQUIRED: 'ACTOR_EN_REQUIRED',

  DETAILSOFSHOW_TC_REQUIRED: 'DETAILSOFSHOW_TC_REQUIRED',
  DETAILSOFSHOW_SC_REQUIRED: 'DETAILSOFSHOW_SC_REQUIRED',
  DETAILSOFSHOW_EN_REQUIRED: 'DETAILSOFSHOW_EN_REQUIRED',

  SHOW_TC_REQUIRED: 'SHOW_TC_REQUIRED',
  SHOW_SC_REQUIRED: 'SHOW_SC_REQUIRED',
  SHOW_EN_REQUIRED: 'SHOW_EN_REQUIRED',

  ALLSHOW_TC_REQUIRED: 'ALLSHOW_TC_REQUIRED',
  ALLSHOW_SC_REQUIRED: 'ALLSHOW_SC_REQUIRED',
  ALLSHOW_EN_REQUIRED: 'ALLSHOW_EN_REQUIRED',

  ACTIVITIES_TC_REQUIRED: 'ACTIVITIES_TC_REQUIRED',
  ACTIVITIES_SC_REQUIRED: 'ACTIVITIES_SC_REQUIRED',
  ACTIVITIES_EN_REQUIRED: 'ACTIVITIES_EN_REQUIRED',

  DOWNLOADPDF_TC_REQUIRED: 'DOWNLOADPDF_TC_REQUIRED',
  DOWNLOADPDF_SC_REQUIRED: 'DOWNLOADPDF_SC_REQUIRED',
  DOWNLOADPDF_EN_REQUIRED: 'DOWNLOADPDF_EN_REQUIRED',

  OURACTORS_TC_REQUIRED: 'OURACTORS_TC_REQUIRED',
  OURACTORS_SC_REQUIRED: 'OURACTORS_SC_REQUIRED',
  OURACTORS_EN_REQUIRED: 'OURACTORS_EN_REQUIRED',

  YMTTHEATER_TC_REQUIRED: 'YMTTHEATER_TC_REQUIRED',
  YMTTHEATER_SC_REQUIRED: 'YMTTHEATER_SC_REQUIRED',
  YMTTHEATER_EN_REQUIRED: 'YMTTHEATER_EN_REQUIRED',

  FOLLOWUS_TC_REQUIRED: 'FOLLOWUS_TC_REQUIRED',
  FOLLOWUS_SC_REQUIRED: 'FOLLOWUS_SC_REQUIRED',
  FOLLOWUS_EN_REQUIRED: 'FOLLOWUS_EN_REQUIRED',

  ALL_TC_REQUIRED: 'ALL_TC_REQUIRED',
  ALL_SC_REQUIRED: 'ALL_SC_REQUIRED',
  ALL_EN_REQUIRED: 'ALL_EN_REQUIRED',

  BOY_TC_REQUIRED: 'BOY_TC_REQUIRED',
  BOY_SC_REQUIRED: 'BOY_SC_REQUIRED',
  BOY_EN_REQUIRED: 'BOY_EN_REQUIRED',

  GIRL_TC_REQUIRED: 'GIRL_TC_REQUIRED',
  GIRL_SC_REQUIRED: 'GIRL_SC_REQUIRED',
  GIRL_EN_REQUIRED: 'GIRL_EN_REQUIRED',

  INHERIT_TC_REQUIRED: 'INHERIT_TC_REQUIRED',
  INHERIT_SC_REQUIRED: 'INHERIT_SC_REQUIRED',
  INHERIT_EN_REQUIRED: 'INHERIT_EN_REQUIRED',

  SHARE_TC_REQUIRED: 'SHARE_TC_REQUIRED',
  SHARE_SC_REQUIRED: 'SHARE_SC_REQUIRED',
  SHARE_EN_REQUIRED: 'SHARE_EN_REQUIRED',

  RELATEDSHOW_TC_REQUIRED: 'RELATEDSHOW_TC_REQUIRED',
  RELATEDSHOW_SC_REQUIRED: 'RELATEDSHOW_SC_REQUIRED',
  RELATEDSHOW_EN_REQUIRED: 'RELATEDSHOW_EN_REQUIRED',

  RELATEDARTISTS_TC_REQUIRED: 'RELATEDARTISTS_TC_REQUIRED',
  RELATEDARTISTS_SC_REQUIRED: 'RELATEDARTISTS_SC_REQUIRED',
  RELATEDARTISTS_EN_REQUIRED: 'RELATEDARTISTS_EN_REQUIRED',

  RELATEDDRAMA_TC_REQUIRED: 'RELATEDDRAMA_TC_REQUIRED',
  RELATEDDRAMA_SC_REQUIRED: 'RELATEDDRAMA_SC_REQUIRED',
  RELATEDDRAMA_EN_REQUIRED: 'RELATEDDRAMA_EN_REQUIRED',

  ALLSHOWS_TC_REQUIRED: 'ALLSHOWS_TC_REQUIRED',
  ALLSHOWS_SC_REQUIRED: 'ALLSHOWS_SC_REQUIRED',
  ALLSHOWS_EN_REQUIRED: 'ALLSHOWS_EN_REQUIRED',

  MORE_TC_REQUIRED: 'MORE_TC_REQUIRED',
  MORE_SC_REQUIRED: 'MORE_SC_REQUIRED',
  MORE_EN_REQUIRED: 'MORE_EN_REQUIRED',

  SCENARIST_TC_REQUIRED: 'SCENARIST_TC_REQUIRED',
  SCENARIST_SC_REQUIRED: 'SCENARIST_SC_REQUIRED',
  SCENARIST_EN_REQUIRED: 'SCENARIST_EN_REQUIRED',

  INTRODUCTION_TC_REQUIRED: 'INTRODUCTION_TC_REQUIRED',
  INTRODUCTION_SC_REQUIRED: 'INTRODUCTION_SC_REQUIRED',
  INTRODUCTION_EN_REQUIRED: 'INTRODUCTION_EN_REQUIRED',

  BUYNOW_TC_REQUIRED: 'BUYNOW_TC_REQUIRED',
  BUYNOW_SC_REQUIRED: 'BUYNOW_SC_REQUIRED',
  BUYNOW_EN_REQUIRED: 'BUYNOW_EN_REQUIRED',

  PARTICIPATING_TC_REQUIRED: 'PARTICIPATING_TC_REQUIRED',
  PARTICIPATING_SC_REQUIRED: 'PARTICIPATING_SC_REQUIRED',
  PARTICIPATING_EN_REQUIRED: 'PARTICIPATING_EN_REQUIRED',

  ROLE_TC_REQUIRED: 'ROLE_TC_REQUIRED',
  ROLE_SC_REQUIRED: 'ROLE_SC_REQUIRED',
  ROLE_EN_REQUIRED: 'ROLE_EN_REQUIRED',

  STUDENTSHOW_TC_REQUIRED: 'STUDENTSHOW_TC_REQUIRED',
  STUDENTSHOW_SC_REQUIRED: 'STUDENTSHOW_SC_REQUIRED',
  STUDENTSHOW_EN_REQUIRED: 'STUDENTSHOW_EN_REQUIRED',

  NEXTSCHEDULE_TC_REQUIRED: 'NEXTSCHEDULE_TC_REQUIRED',
  NEXTSCHEDULE_SC_REQUIRED: 'NEXTSCHEDULE_SC_REQUIRED',
  NEXTSCHEDULE_EN_REQUIRED: 'NEXTSCHEDULE_EN_REQUIRED',

  LEAVECONTACT_TC_REQUIRED: 'LEAVECONTACT_TC_REQUIRED',
  LEAVECONTACT_SC_REQUIRED: 'LEAVECONTACT_SC_REQUIRED',
  LEAVECONTACT_EN_REQUIRED: 'LEAVECONTACT_EN_REQUIRED',

  PUBLICSHOW_TC_REQUIRED: 'PUBLICSHOW_TC_REQUIRED',
  PUBLICSHOW_SC_REQUIRED: 'PUBLICSHOW_SC_REQUIRED',
  PUBLICSHOW_EN_REQUIRED: 'PUBLICSHOW_EN_REQUIRED',

  PROGRAMOFSHOW_TC_REQUIRED: 'PROGRAMOFSHOW_TC_REQUIRED',
  PROGRAMOFSHOW_SC_REQUIRED: 'PROGRAMOFSHOW_SC_REQUIRED',
  PROGRAMOFSHOW_EN_REQUIRED: 'PROGRAMOFSHOW_EN_REQUIRED',

  TOTAL1_TC_REQUIRED: 'TOTAL1_TC_REQUIRED',
  TOTAL1_SC_REQUIRED: 'TOTAL1_SC_REQUIRED',
  TOTAL1_EN_REQUIRED: 'TOTAL1_EN_REQUIRED',

  TOTAL2_TC_REQUIRED: 'TOTAL2_TC_REQUIRED',
  TOTAL2_SC_REQUIRED: 'TOTAL2_SC_REQUIRED',
  TOTAL2_EN_REQUIRED: 'TOTAL2_EN_REQUIRED',

  ABOUT_TC_REQUIRED: 'ABOUT_TC_REQUIRED',
  ABOUT_SC_REQUIRED: 'ABOUT_SC_REQUIRED',
  ABOUT_EN_REQUIRED: 'ABOUT_EN_REQUIRED',

  MAP_TC_REQUIRED: 'MAP_TC_REQUIRED',
  MAP_SC_REQUIRED: 'MAP_SC_REQUIRED',
  MAP_EN_REQUIRED: 'MAP_EN_REQUIRED',

  TRAFFIC_TC_REQUIRED: 'TRAFFIC_TC_REQUIRED',
  TRAFFIC_SC_REQUIRED: 'TRAFFIC_SC_REQUIRED',
  TRAFFIC_EN_REQUIRED: 'TRAFFIC_EN_REQUIRED',

  CONTACT_TC_REQUIRED: 'CONTACT_TC_REQUIRED',
  CONTACT_SC_REQUIRED: 'CONTACT_SC_REQUIRED',
  CONTACT_EN_REQUIRED: 'CONTACT_EN_REQUIRED',

  WEBSITE_TC_REQUIRED: 'WEBSITE_TC_REQUIRED',
  WEBSITE_SC_REQUIRED: 'WEBSITE_SC_REQUIRED',
  WEBSITE_EN_REQUIRED: 'WEBSITE_EN_REQUIRED',

  TEL_TC_REQUIRED: 'TEL_TC_REQUIRED',
  TEL_SC_REQUIRED: 'TEL_SC_REQUIRED',
  TEL_EN_REQUIRED: 'TEL_EN_REQUIRED',

  FAX_TC_REQUIRED: 'FAX_TC_REQUIRED',
  FAX_SC_REQUIRED: 'FAX_SC_REQUIRED',
  FAX_EN_REQUIRED: 'FAX_EN_REQUIRED',

  EMAIL_TC_REQUIRED: 'EMAIL_TC_REQUIRED',
  EMAIL_SC_REQUIRED: 'EMAIL_SC_REQUIRED',
  EMAIL_EN_REQUIRED: 'EMAIL_EN_REQUIRED',

  RESEARCH_AND_EDUCATION_TC_REQUIRED: 'RESEARCH_AND_EDUCATION_TC_REQUIRED',
  RESEARCH_AND_EDUCATION_SC_REQUIRED: 'RESEARCH_AND_EDUCATION_SC_REQUIRED',
  RESEARCH_AND_EDUCATION_EN_REQUIRED: 'RESEARCH_AND_EDUCATION_EN_REQUIRED',

  KNOWLEDGE_TC_REQUIRED: 'KNOWLEDGE_TC_REQUIRED',
  KNOWLEDGE_SC_REQUIRED: 'KNOWLEDGE_SC_REQUIRED',
  KNOWLEDGE_EN_REQUIRED: 'KNOWLEDGE_EN_REQUIRED',

  WORKSHOP_TC_REQUIRED: 'WORKSHOP_TC_REQUIRED',
  WORKSHOP_SC_REQUIRED: 'WORKSHOP_SC_REQUIRED',
  WORKSHOP_EN_REQUIRED: 'WORKSHOP_EN_REQUIRED',

  VIDEO_SHOW_TC_REQUIRED: 'VIDEO_SHOW_TC_REQUIRED',
  VIDEO_SHOW_SC_REQUIRED: 'VIDEO_SHOW_SC_REQUIRED',
  VIDEO_SHOW_EN_REQUIRED: 'VIDEO_SHOW_EN_REQUIRED',

  SHARING_TC_REQUIRED: 'SHARING_TC_REQUIRED',
  SHARING_SC_REQUIRED: 'SHARING_SC_REQUIRED',
  SHARING_EN_REQUIRED: 'SHARING_EN_REQUIRED',

  PAST_ACTIVITY_TC_REQUIRED: 'PAST_ACTIVITY_TC_REQUIRED',
  PAST_ACTIVITY_SC_REQUIRED: 'PAST_ACTIVITY_SC_REQUIRED',
  PAST_ACTIVITY_EN_REQUIRED: 'PAST_ACTIVITY_EN_REQUIRED',

  DETAILS_TC_REQUIRED: 'DETAILS_TC_REQUIRED',
  DETAILS_SC_REQUIRED: 'DETAILS_SC_REQUIRED',
  DETAILS_EN_REQUIRED: 'DETAILS_EN_REQUIRED',

  DATEOFSHOW_TC_REQUIRED: 'DATEOFSHOW_TC_REQUIRED',
  DATEOFSHOW_SC_REQUIRED: 'DATEOFSHOW_SC_REQUIRED',
  DATEOFSHOW_EN_REQUIRED: 'DATEOFSHOW_EN_REQUIRED',

  LOCATION_TC_REQUIRED: 'LOCATION_TC_REQUIRED',
  LOCATION_SC_REQUIRED: 'LOCATION_SC_REQUIRED',
  LOCATION_EN_REQUIRED: 'LOCATION_EN_REQUIRED',

  RELATEDNEWS_TC_REQUIRED: 'RELATEDNEWS_TC_REQUIRED',
  RELATEDNEWS_SC_REQUIRED: 'RELATEDNEWS_SC_REQUIRED',
  RELATEDNEWS_EN_REQUIRED: 'RELATEDNEWS_EN_REQUIRED',

  // db check
  GLOBAL_CONSTANTS_NOT_EXISTS: 'GLOBAL_CONSTANTS_NOT_EXISTS'
};
