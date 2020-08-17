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

  latestShowIcon1_tc: {
    type: String,
    require: true
  },
  latestShowIcon1_sc: {
    type: String,
    require: true
  },
  latestShowIcon1_en: {
    type: String,
    require: true
  },

  latestShowIcon2_tc: {
    type: String,
    require: true
  },
  latestShowIcon2_sc: {
    type: String,
    require: true
  },
  latestShowIcon2_en: {
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

  teams_tc: {
    type: String,
    require: true
  },
  teams_sc: {
    type: String,
    require: true
  },
  teams_en: {
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

  artist_tc: {
    type: String,
    require: true
  },
  artist_sc: {
    type: String,
    require: true
  },
  artist_en: {
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

  contactInfo_tc: {
    type: String,
    require: true
  },
  contactInfo_sc: {
    type: String,
    require: true
  },
  contactInfo_en: {
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

  researchAndEducation_tc: {
    type: String,
    require: true
  },
  researchAndEducation_sc: {
    type: String,
    require: true
  },
  researchAndEducation_en: {
    type: String,
    require: true
  },

  guidedTalk_tc: {
    type: String,
    require: true
  },
  guidedTalk_sc: {
    type: String,
    require: true
  },
  guidedTalk_en: {
    type: String,
    require: true
  },

  youthProgramme_tc: {
    type: String,
    require: true
  },
  youthProgramme_sc: {
    type: String,
    require: true
  },
  youthProgramme_en: {
    type: String,
    require: true
  },

  cantoneseOperaKnowledge_tc: {
    type: String,
    require: true
  },
  cantoneseOperaKnowledge_sc: {
    type: String,
    require: true
  },
  cantoneseOperaKnowledge_en: {
    type: String,
    require: true
  },

  collegeShow_tc: {
    type: String,
    require: true
  },
  collegeShow_sc: {
    type: String,
    require: true
  },
  collegeShow_en: {
    type: String,
    require: true
  },

  exhibition_tc: {
    type: String,
    require: true
  },
  exhibition_sc: {
    type: String,
    require: true
  },
  exhibition_en: {
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

  news_tc: {
    type: String,
    require: true
  },
  news_sc: {
    type: String,
    require: true
  },
  news_en: {
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

  ticketInfo_tc: {
    type: String,
    require: true
  },
  ticketInfo_sc: {
    type: String,
    require: true
  },
  ticketInfo_en: {
    type: String,
    require: true
  },

  venue_tc: {
    type: String,
    require: true
  },
  venue_sc: {
    type: String,
    require: true
  },
  venue_en: {
    type: String,
    require: true
  },

  ticketPrice_tc: {
    type: String,
    require: true
  },
  ticketPrice_sc: {
    type: String,
    require: true
  },
  ticketPrice_en: {
    type: String,
    require: true
  },

  ticketWebsite_tc: {
    type: String,
    require: true
  },
  ticketWebsite_sc: {
    type: String,
    require: true
  },
  ticketWebsite_en: {
    type: String,
    require: true
  },

  barwo_tc: {
    type: String,
    require: true
  },
  barwo_sc: {
    type: String,
    require: true
  },
  barwo_en: {
    type: String,
    require: true
  },

  plan_tc: {
    type: String,
    require: true
  },
  plan_sc: {
    type: String,
    require: true
  },
  plan_en: {
    type: String,
    require: true
  },

  admins_tc: {
    type: String,
    require: true
  },
  admins_sc: {
    type: String,
    require: true
  },
  admins_en: {
    type: String,
    require: true
  },

  productionPersons_tc: {
    type: String,
    require: true
  },
  productionPersons_sc: {
    type: String,
    require: true
  },
  productionPersons_en: {
    type: String,
    require: true
  },

  organizer_tc: {
    type: String,
    require: true
  },
  organizer_sc: {
    type: String,
    require: true
  },
  organizer_en: {
    type: String,
    require: true
  },

  sponsor_tc: {
    type: String,
    require: true
  },
  sponsor_sc: {
    type: String,
    require: true
  },
  sponsor_en: {
    type: String,
    require: true
  },

  search_tc: {
    type: String,
    require: true
  },
  search_sc: {
    type: String,
    require: true
  },
  search_en: {
    type: String,
    require: true
  },

  activity_tc: {
    type: String,
    require: true
  },
  activity_sc: {
    type: String,
    require: true
  },
  activity_en: {
    type: String,
    require: true
  },

  event_tc: {
    type: String,
    require: true
  },
  event_sc: {
    type: String,
    require: true
  },
  event_en: {
    type: String,
    require: true
  },

  SPECIAL_NOTICE_tc: {
    type: String,
    require: true
  },
  SPECIAL_NOTICE_sc: {
    type: String,
    require: true
  },
  SPECIAL_NOTICE_en: {
    type: String,
    require: true
  },

  PRESS_RELEASE_tc: {
    type: String,
    require: true
  },
  PRESS_RELEASE_sc: {
    type: String,
    require: true
  },
  PRESS_RELEASE_en: {
    type: String,
    require: true
  },

  INTERVIEW_tc: {
    type: String,
    require: true
  },
  INTERVIEW_sc: {
    type: String,
    require: true
  },
  INTERVIEW_en: {
    type: String,
    require: true
  },

  newsmedia_tc: {
    type: String,
    require: true
  },
  newsmedia_sc: {
    type: String,
    require: true
  },
  newsmedia_en: {
    type: String,
    require: true
  },

  newsletter_tc: {
    type: String,
    require: true
  },
  newsletter_sc: {
    type: String,
    require: true
  },
  newsletter_en: {
    type: String,
    require: true
  },

  EMAIL_SUCCESS_tc: {
    type: String,
    require: true
  },
  EMAIL_SUCCESS_sc: {
    type: String,
    require: true
  },
  EMAIL_SUCCESS_en: {
    type: String,
    require: true
  },

  EMAIL_ADDRESS_INVALID_tc: {
    type: String,
    require: true
  },
  EMAIL_ADDRESS_INVALID_sc: {
    type: String,
    require: true
  },
  EMAIL_ADDRESS_INVALID_en: {
    type: String,
    require: true
  },

  EMAIL_ADDRESS_ALREADY_EXISTS_tc: {
    type: String,
    require: true
  },
  EMAIL_ADDRESS_ALREADY_EXISTS_sc: {
    type: String,
    require: true
  },
  EMAIL_ADDRESS_ALREADY_EXISTS_en: {
    type: String,
    require: true
  },

  subscribeMsg_tc: {
    type: String,
    require: true
  },
  subscribeMsg_sc: {
    type: String,
    require: true
  },
  subscribeMsg_en: {
    type: String,
    require: true
  },

  contactus_tc: {
    type: String,
    require: true
  },
  contactus_sc: {
    type: String,
    require: true
  },
  contactus_en: {
    type: String,
    require: true
  },

  pastEvents_tc: {
    type: String,
    require: true
  },
  pastEvents_sc: {
    type: String,
    require: true
  },
  pastEvents_en: {
    type: String,
    require: true
  },

  termsAndConditions_tc: {
    type: String,
    require: true
  },
  termsAndConditions_sc: {
    type: String,
    require: true
  },
  termsAndConditions_en: {
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

  LATESTSHOWICON1_TC_REQUIRED: 'LATESTSHOWICON1_TC_REQUIRED',
  LATESTSHOWICON1_SC_REQUIRED: 'LATESTSHOWICON1_SC_REQUIRED',
  LATESTSHOWICON1_EN_REQUIRED: 'LATESTSHOWICON1_EN_REQUIRED',

  LATESTSHOWICON2_TC_REQUIRED: 'LATESTSHOWICON2_TC_REQUIRED',
  LATESTSHOWICON2_SC_REQUIRED: 'LATESTSHOWICON2_SC_REQUIRED',
  LATESTSHOWICON2_EN_REQUIRED: 'LATESTSHOWICON2_EN_REQUIRED',

  SCHEDULEOFSHOW_TC_REQUIRED: 'SCHEDULEOFSHOW_TC_REQUIRED',
  SCHEDULEOFSHOW_SC_REQUIRED: 'SCHEDULEOFSHOW_SC_REQUIRED',
  SCHEDULEOFSHOW_EN_REQUIRED: 'SCHEDULEOFSHOW_EN_REQUIRED',

  TEAMS_TC_REQUIRED: 'TEAMS_TC_REQUIRED',
  TEAMS_SC_REQUIRED: 'TEAMS_SC_REQUIRED',
  TEAMS_EN_REQUIRED: 'TEAMS_EN_REQUIRED',

  ARTDIRECTOR_TC_REQUIRED: 'ARTDIRECTOR_TC_REQUIRED',
  ARTDIRECTOR_SC_REQUIRED: 'ARTDIRECTOR_SC_REQUIRED',
  ARTDIRECTOR_EN_REQUIRED: 'ARTDIRECTOR_EN_REQUIRED',

  ACTOR_TC_REQUIRED: 'ACTOR_TC_REQUIRED',
  ACTOR_SC_REQUIRED: 'ACTOR_SC_REQUIRED',
  ACTOR_EN_REQUIRED: 'ACTOR_EN_REQUIRED',

  ARTIST_TC_REQUIRED: 'ARTIST_TC_REQUIRED',
  ARTIST_SC_REQUIRED: 'ARTIST_SC_REQUIRED',
  ARTIST_EN_REQUIRED: 'ARTIST_EN_REQUIRED',

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

  CONTACTINFO_TC_REQUIRED: 'CONTACTINFO_TC_REQUIRED',
  CONTACTINFO_SC_REQUIRED: 'CONTACTINFO_SC_REQUIRED',
  CONTACTINFO_EN_REQUIRED: 'CONTACTINFO_EN_REQUIRED',

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

  GUIDED_TALK_TC_REQUIRED: 'GUIDED_TALK_TC_REQUIRED',
  GUIDED_TALK_SC_REQUIRED: 'GUIDED_TALK_SC_REQUIRED',
  GUIDED_TALK_EN_REQUIRED: 'GUIDED_TALK_EN_REQUIRED',

  YOUTH_PROGRAMME_TC_REQUIRED: 'YOUTH_PROGRAMME_TC_REQUIRED',
  YOUTH_PROGRAMME_SC_REQUIRED: 'YOUTH_PROGRAMME_SC_REQUIRED',
  YOUTH_PROGRAMME_EN_REQUIRED: 'YOUTH_PROGRAMME_EN_REQUIRED',

  CANTONESE_OPERA_KNOWLEDGE_TC_REQUIRED:
    'CANTONESE_OPERA_KNOWLEDGE_TC_REQUIRED',
  CANTONESE_OPERA_KNOWLEDGE_SC_REQUIRED:
    'CANTONESE_OPERA_KNOWLEDGE_SC_REQUIRED',
  CANTONESE_OPERA_KNOWLEDGE_EN_REQUIRED:
    'CANTONESE_OPERA_KNOWLEDGE_EN_REQUIRED',

  COLLEGE_SHOW_TC_REQUIRED: 'COLLEGE_SHOW_TC_REQUIRED',
  COLLEGE_SHOW_SC_REQUIRED: 'COLLEGE_SHOW_SC_REQUIRED',
  COLLEGE_SHOW_EN_REQUIRED: 'COLLEGE_SHOW_EN_REQUIRED',

  EXHIBITION_TC_REQUIRED: 'EXHIBITION_TC_REQUIRED',
  EXHIBITION_SC_REQUIRED: 'EXHIBITION_SC_REQUIRED',
  EXHIBITION_EN_REQUIRED: 'EXHIBITION_EN_REQUIRED',

  DETAILS_TC_REQUIRED: 'DETAILS_TC_REQUIRED',
  DETAILS_SC_REQUIRED: 'DETAILS_SC_REQUIRED',
  DETAILS_EN_REQUIRED: 'DETAILS_EN_REQUIRED',

  DATEOFSHOW_TC_REQUIRED: 'DATEOFSHOW_TC_REQUIRED',
  DATEOFSHOW_SC_REQUIRED: 'DATEOFSHOW_SC_REQUIRED',
  DATEOFSHOW_EN_REQUIRED: 'DATEOFSHOW_EN_REQUIRED',

  LOCATION_TC_REQUIRED: 'LOCATION_TC_REQUIRED',
  LOCATION_SC_REQUIRED: 'LOCATION_SC_REQUIRED',
  LOCATION_EN_REQUIRED: 'LOCATION_EN_REQUIRED',

  NEWS_TC_REQUIRED: 'NEWS_TC_REQUIRED',
  NEWS_SC_REQUIRED: 'NEWS_SC_REQUIRED',
  NEWS_EN_REQUIRED: 'NEWS_EN_REQUIRED',

  RELATEDNEWS_TC_REQUIRED: 'RELATEDNEWS_TC_REQUIRED',
  RELATEDNEWS_SC_REQUIRED: 'RELATEDNEWS_SC_REQUIRED',
  RELATEDNEWS_EN_REQUIRED: 'RELATEDNEWS_EN_REQUIRED',

  TICKETINFO_TC_REQUIRED: 'TICKETINFO_TC_REQUIRED',
  TICKETINFO_SC_REQUIRED: 'TICKETINFO_SC_REQUIRED',
  TICKETINFO_EN_REQUIRED: 'TICKETINFO_EN_REQUIRED',

  VENUE_TC_REQUIRED: 'VENUE_TC_REQUIRED',
  VENUE_SC_REQUIRED: 'VENUE_SC_REQUIRED',
  VENUE_EN_REQUIRED: 'VENUE_EN_REQUIRED',

  TICKETPRICE_TC_REQUIRED: 'TICKETPRICE_TC_REQUIRED',
  TICKETPRICE_SC_REQUIRED: 'TICKETPRICE_SC_REQUIRED',
  TICKETPRICE_EN_REQUIRED: 'TICKETPRICE_EN_REQUIRED',

  TICKETWEBSITE_TC_REQUIRED: 'TICKETWEBSITE_TC_REQUIRED',
  TICKETWEBSITE_SC_REQUIRED: 'TICKETWEBSITE_SC_REQUIRED',
  TICKETWEBSITE_EN_REQUIRED: 'TICKETWEBSITE_EN_REQUIRED',

  BARWO_TC_REQUIRED: 'BARWO_TC_REQUIRED',
  BARWO_SC_REQUIRED: 'BARWO_SC_REQUIRED',
  BARWO_EN_REQUIRED: 'BARWO_EN_REQUIRED',

  PLAN_TC_REQUIRED: 'PLAN_TC_REQUIRED',
  PLAN_SC_REQUIRED: 'PLAN_SC_REQUIRED',
  PLAN_EN_REQUIRED: 'PLAN_EN_REQUIRED',

  ADMINS_TC_REQUIRED: 'ADMINS_TC_REQUIRED',
  ADMINS_SC_REQUIRED: 'ADMINS_SC_REQUIRED',
  ADMINS_EN_REQUIRED: 'ADMINS_EN_REQUIRED',

  PRODUCTIONPERSONS_TC_REQUIRED: 'PRODUCTIONPERSONS_TC_REQUIRED',
  PRODUCTIONPERSONS_SC_REQUIRED: 'PRODUCTIONPERSONS_SC_REQUIRED',
  PRODUCTIONPERSONS_EN_REQUIRED: 'PRODUCTIONPERSONS_EN_REQUIRED',

  ORGANIZER_TC_REQUIRED: 'ORGANIZER_TC_REQUIRED',
  ORGANIZER_SC_REQUIRED: 'ORGANIZER_SC_REQUIRED',
  ORGANIZER_EN_REQUIRED: 'ORGANIZER_EN_REQUIRED',

  SPONSOR_TC_REQUIRED: 'SPONSOR_TC_REQUIRED',
  SPONSOR_SC_REQUIRED: 'SPONSOR_SC_REQUIRED',
  SPONSOR_EN_REQUIRED: 'SPONSOR_EN_REQUIRED',

  SEARCH_TC_REQUIRED: 'SEARCH_TC_REQUIRED',
  SEARCH_SC_REQUIRED: 'SEARCH_SC_REQUIRED',
  SEARCH_EN_REQUIRED: 'SEARCH_EN_REQUIRED',

  ACTIVITY_TC_REQUIRED: 'ACTIVITY_TC_REQUIRED',
  ACTIVITY_SC_REQUIRED: 'ACTIVITY_SC_REQUIRED',
  ACTIVITY_EN_REQUIRED: 'ACTIVITY_EN_REQUIRED',

  EVENT_TC_REQUIRED: 'EVENT_TC_REQUIRED',
  EVENT_SC_REQUIRED: 'EVENT_SC_REQUIRED',
  EVENT_EN_REQUIRED: 'EVENT_EN_REQUIRED',

  SPECIAL_NOTICE_TC_REQUIRED: 'SPECIAL_NOTICE_TC_REQUIRED',
  SPECIAL_NOTICE_SC_REQUIRED: 'SPECIAL_NOTICE_SC_REQUIRED',
  SPECIAL_NOTICE_EN_REQUIRED: 'SPECIAL_NOTICE_EN_REQUIRED',

  PRESS_RELEASE_TC_REQUIRED: 'PRESS_RELEASE_TC_REQUIRED',
  PRESS_RELEASE_SC_REQUIRED: 'PRESS_RELEASE_SC_REQUIRED',
  PRESS_RELEASE_EN_REQUIRED: 'PRESS_RELEASE_EN_REQUIRED',

  INTERVIEW_TC_REQUIRED: 'INTERVIEW_TC_REQUIRED',
  INTERVIEW_SC_REQUIRED: 'INTERVIEW_SC_REQUIRED',
  INTERVIEW_EN_REQUIRED: 'INTERVIEW_EN_REQUIRED',

  NEWSMEDIA_TC_REQUIRED: 'NEWSMEDIA_TC_REQUIRED',
  NEWSMEDIA_SC_REQUIRED: 'NEWSMEDIA_SC_REQUIRED',
  NEWSMEDIA_EN_REQUIRED: 'NEWSMEDIA_EN_REQUIRED',

  NEWSLETTER_TC_REQUIRED: 'NEWSLETTER_TC_REQUIRED',
  NEWSLETTER_SC_REQUIRED: 'NEWSLETTER_SC_REQUIRED',
  NEWSLETTER_EN_REQUIRED: 'NEWSLETTER_EN_REQUIRED',

  EMAIL_SUCCESS_TC_REQUIRED: 'EMAIL_SUCCESS_TC_REQUIRED',
  EMAIL_SUCCESS_SC_REQUIRED: 'EMAIL_SUCCESS_SC_REQUIRED',
  EMAIL_SUCCESS_EN_REQUIRED: 'EMAIL_SUCCESS_EN_REQUIRED',

  EMAIL_ADDRESS_INVALID_TC_REQUIRED: 'EMAIL_ADDRESS_INVALID_TC_REQUIRED',
  EMAIL_ADDRESS_INVALID_SC_REQUIRED: 'EMAIL_ADDRESS_INVALID_SC_REQUIRED',
  EMAIL_ADDRESS_INVALID_EN_REQUIRED: 'EMAIL_ADDRESS_INVALID_EN_REQUIRED',

  EMAIL_ADDRESS_ALREADY_EXISTS_TC_REQUIRED:
    'EMAIL_ADDRESS_ALREADY_EXISTS_TC_REQUIRED',
  EMAIL_ADDRESS_ALREADY_EXISTS_SC_REQUIRED:
    'EMAIL_ADDRESS_ALREADY_EXISTS_SC_REQUIRED',
  EMAIL_ADDRESS_ALREADY_EXISTS_EN_REQUIRED:
    'EMAIL_ADDRESS_ALREADY_EXISTS_EN_REQUIRED',

  SUBSCRIBE_MSG_TC_REQUIRED: 'SUBSCRIBE_MSG_TC_REQUIRED',
  SUBSCRIBE_MSG_SC_REQUIRED: 'SUBSCRIBE_MSG_SC_REQUIRED',
  SUBSCRIBE_MSG_EN_REQUIRED: 'SUBSCRIBE_MSG_EN_REQUIRED',

  CONTACTUS_TC_REQUIRED: 'CONTACTUS_TC_REQUIRED',
  CONTACTUS_SC_REQUIRED: 'CONTACTUS_SC_REQUIRED',
  CONTACTUS_EN_REQUIRED: 'CONTACTUS_EN_REQUIRED',

  PAST_EVENTS_TC_REQUIRED: 'PAST_EVENTS_TC_REQUIRED',
  PAST_EVENTS_SC_REQUIRED: 'PAST_EVENTS_SC_REQUIRED',
  PAST_EVENTS_EN_REQUIRED: 'PAST_EVENTS_EN_REQUIRED',

  TERMS_AND_CONDITIONS_TC_REQUIRED: 'TERMS_AND_CONDITIONS_TC_REQUIRED',
  TERMS_AND_CONDITIONS_SC_REQUIRED: 'TERMS_AND_CONDITIONS_SC_REQUIRED',
  TERMS_AND_CONDITIONS_EN_REQUIRED: 'TERMS_AND_CONDITIONS_EN_REQUIRED',

  // db check
  GLOBAL_CONSTANTS_NOT_EXISTS: 'GLOBAL_CONSTANTS_NOT_EXISTS'
};
