const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  GlobalConstants,
  globalConstantsResponseTypes
} = require('../../../models/GlobalConstants');

/* utilities */

const globalConstantsSelect = {};

const globalConstantsPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const globalConstantsValidationChecks = [
  check(
    'latestShow_tc',
    globalConstantsResponseTypes.LATESTSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'latestShow_sc',
    globalConstantsResponseTypes.LATESTSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'latestShow_en',
    globalConstantsResponseTypes.LATESTSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'latestShowIcon1_tc',
    globalConstantsResponseTypes.LATESTSHOWICON_TC_REQUIRED
  ).notEmpty(),
  check(
    'latestShowIcon1_sc',
    globalConstantsResponseTypes.LATESTSHOWICON_SC_REQUIRED
  ).notEmpty(),
  check(
    'latestShowIcon1_en',
    globalConstantsResponseTypes.LATESTSHOWICON_EN_REQUIRED
  ).notEmpty(),

  check(
    'latestShowIcon2_tc',
    globalConstantsResponseTypes.LATESTSHOWICON_TC_REQUIRED
  ).notEmpty(),
  check(
    'latestShowIcon2_sc',
    globalConstantsResponseTypes.LATESTSHOWICON_SC_REQUIRED
  ).notEmpty(),
  check(
    'latestShowIcon2_en',
    globalConstantsResponseTypes.LATESTSHOWICON_EN_REQUIRED
  ).notEmpty(),

  check(
    'scheduleOfShow_tc',
    globalConstantsResponseTypes.SCHEDULEOFSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'scheduleOfShow_sc',
    globalConstantsResponseTypes.SCHEDULEOFSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'scheduleOfShow_en',
    globalConstantsResponseTypes.SCHEDULEOFSHOW_EN_REQUIRED
  ).notEmpty(),

  check('teams_tc', globalConstantsResponseTypes.TEAMS_TC_REQUIRED).notEmpty(),
  check('teams_sc', globalConstantsResponseTypes.TEAMS_SC_REQUIRED).notEmpty(),
  check('teams_en', globalConstantsResponseTypes.TEAMS_EN_REQUIRED).notEmpty(),

  check(
    'artDirector_tc',
    globalConstantsResponseTypes.ARTDIRECTOR_TC_REQUIRED
  ).notEmpty(),
  check(
    'artDirector_sc',
    globalConstantsResponseTypes.ARTDIRECTOR_SC_REQUIRED
  ).notEmpty(),
  check(
    'artDirector_en',
    globalConstantsResponseTypes.ARTDIRECTOR_EN_REQUIRED
  ).notEmpty(),

  check('actor_tc', globalConstantsResponseTypes.ACTOR_TC_REQUIRED).notEmpty(),
  check('actor_sc', globalConstantsResponseTypes.ACTOR_SC_REQUIRED).notEmpty(),
  check('actor_en', globalConstantsResponseTypes.ACTOR_EN_REQUIRED).notEmpty(),

  check(
    'artist_tc',
    globalConstantsResponseTypes.ARTIST_TC_REQUIRED
  ).notEmpty(),
  check(
    'artist_sc',
    globalConstantsResponseTypes.ARTIST_SC_REQUIRED
  ).notEmpty(),
  check(
    'artist_en',
    globalConstantsResponseTypes.ARTIST_EN_REQUIRED
  ).notEmpty(),

  check(
    'detailsOfShow_tc',
    globalConstantsResponseTypes.DETAILSOFSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'detailsOfShow_sc',
    globalConstantsResponseTypes.DETAILSOFSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'detailsOfShow_en',
    globalConstantsResponseTypes.DETAILSOFSHOW_EN_REQUIRED
  ).notEmpty(),

  check('show_tc', globalConstantsResponseTypes.SHOW_TC_REQUIRED).notEmpty(),
  check('show_sc', globalConstantsResponseTypes.SHOW_SC_REQUIRED).notEmpty(),
  check('show_en', globalConstantsResponseTypes.SHOW_EN_REQUIRED).notEmpty(),

  check(
    'allShow_tc',
    globalConstantsResponseTypes.ALLSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'allShow_sc',
    globalConstantsResponseTypes.ALLSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'allShow_en',
    globalConstantsResponseTypes.ALLSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'activities_tc',
    globalConstantsResponseTypes.ACTIVITIES_TC_REQUIRED
  ).notEmpty(),
  check(
    'activities_sc',
    globalConstantsResponseTypes.ACTIVITIES_SC_REQUIRED
  ).notEmpty(),
  check(
    'activities_en',
    globalConstantsResponseTypes.ACTIVITIES_EN_REQUIRED
  ).notEmpty(),

  check(
    'downloadPDF_tc',
    globalConstantsResponseTypes.DOWNLOADPDF_TC_REQUIRED
  ).notEmpty(),
  check(
    'downloadPDF_sc',
    globalConstantsResponseTypes.DOWNLOADPDF_SC_REQUIRED
  ).notEmpty(),
  check(
    'downloadPDF_en',
    globalConstantsResponseTypes.DOWNLOADPDF_EN_REQUIRED
  ).notEmpty(),

  check(
    'ourActors_tc',
    globalConstantsResponseTypes.OURACTORS_TC_REQUIRED
  ).notEmpty(),
  check(
    'ourActors_sc',
    globalConstantsResponseTypes.OURACTORS_SC_REQUIRED
  ).notEmpty(),
  check(
    'ourActors_en',
    globalConstantsResponseTypes.OURACTORS_EN_REQUIRED
  ).notEmpty(),

  check(
    'ymtTheater_tc',
    globalConstantsResponseTypes.YMTTHEATER_TC_REQUIRED
  ).notEmpty(),
  check(
    'ymtTheater_sc',
    globalConstantsResponseTypes.YMTTHEATER_SC_REQUIRED
  ).notEmpty(),
  check(
    'ymtTheater_en',
    globalConstantsResponseTypes.YMTTHEATER_EN_REQUIRED
  ).notEmpty(),

  check(
    'followUs_tc',
    globalConstantsResponseTypes.FOLLOWUS_TC_REQUIRED
  ).notEmpty(),
  check(
    'followUs_sc',
    globalConstantsResponseTypes.FOLLOWUS_SC_REQUIRED
  ).notEmpty(),
  check(
    'followUs_en',
    globalConstantsResponseTypes.FOLLOWUS_EN_REQUIRED
  ).notEmpty(),

  check('all_tc', globalConstantsResponseTypes.ALL_TC_REQUIRED).notEmpty(),
  check('all_sc', globalConstantsResponseTypes.ALL_SC_REQUIRED).notEmpty(),
  check('all_en', globalConstantsResponseTypes.ALL_EN_REQUIRED).notEmpty(),

  check('boy_tc', globalConstantsResponseTypes.BOY_TC_REQUIRED).notEmpty(),
  check('boy_sc', globalConstantsResponseTypes.BOY_SC_REQUIRED).notEmpty(),
  check('boy_en', globalConstantsResponseTypes.BOY_EN_REQUIRED).notEmpty(),

  check('girl_tc', globalConstantsResponseTypes.GIRL_TC_REQUIRED).notEmpty(),
  check('girl_sc', globalConstantsResponseTypes.GIRL_SC_REQUIRED).notEmpty(),
  check('girl_en', globalConstantsResponseTypes.GIRL_EN_REQUIRED).notEmpty(),

  check(
    'inherit_tc',
    globalConstantsResponseTypes.INHERIT_TC_REQUIRED
  ).notEmpty(),
  check(
    'inherit_sc',
    globalConstantsResponseTypes.INHERIT_SC_REQUIRED
  ).notEmpty(),
  check(
    'inherit_en',
    globalConstantsResponseTypes.INHERIT_EN_REQUIRED
  ).notEmpty(),

  check('share_tc', globalConstantsResponseTypes.SHARE_TC_REQUIRED).notEmpty(),
  check('share_sc', globalConstantsResponseTypes.SHARE_SC_REQUIRED).notEmpty(),
  check('share_en', globalConstantsResponseTypes.SHARE_EN_REQUIRED).notEmpty(),

  check(
    'relatedShow_tc',
    globalConstantsResponseTypes.RELATEDSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'relatedShow_sc',
    globalConstantsResponseTypes.RELATEDSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'relatedShow_en',
    globalConstantsResponseTypes.RELATEDSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'relatedArtists_tc',
    globalConstantsResponseTypes.RELATEDARTISTS_TC_REQUIRED
  ).notEmpty(),
  check(
    'relatedArtists_sc',
    globalConstantsResponseTypes.RELATEDARTISTS_SC_REQUIRED
  ).notEmpty(),
  check(
    'relatedArtists_en',
    globalConstantsResponseTypes.RELATEDARTISTS_EN_REQUIRED
  ).notEmpty(),

  check(
    'relatedDrama_tc',
    globalConstantsResponseTypes.RELATEDDRAMA_TC_REQUIRED
  ).notEmpty(),
  check(
    'relatedDrama_sc',
    globalConstantsResponseTypes.RELATEDDRAMA_SC_REQUIRED
  ).notEmpty(),
  check(
    'relatedDrama_en',
    globalConstantsResponseTypes.RELATEDDRAMA_EN_REQUIRED
  ).notEmpty(),

  check(
    'allShows_tc',
    globalConstantsResponseTypes.ALLSHOWS_TC_REQUIRED
  ).notEmpty(),
  check(
    'allShows_sc',
    globalConstantsResponseTypes.ALLSHOWS_SC_REQUIRED
  ).notEmpty(),
  check(
    'allShows_en',
    globalConstantsResponseTypes.ALLSHOWS_EN_REQUIRED
  ).notEmpty(),

  check('more_tc', globalConstantsResponseTypes.MORE_TC_REQUIRED).notEmpty(),
  check('more_sc', globalConstantsResponseTypes.MORE_SC_REQUIRED).notEmpty(),
  check('more_en', globalConstantsResponseTypes.MORE_EN_REQUIRED).notEmpty(),

  check(
    'scenarist_tc',
    globalConstantsResponseTypes.SCENARIST_TC_REQUIRED
  ).notEmpty(),
  check(
    'scenarist_sc',
    globalConstantsResponseTypes.SCENARIST_SC_REQUIRED
  ).notEmpty(),
  check(
    'scenarist_en',
    globalConstantsResponseTypes.SCENARIST_EN_REQUIRED
  ).notEmpty(),

  check(
    'introduction_tc',
    globalConstantsResponseTypes.INTRODUCTION_TC_REQUIRED
  ).notEmpty(),
  check(
    'introduction_sc',
    globalConstantsResponseTypes.INTRODUCTION_SC_REQUIRED
  ).notEmpty(),
  check(
    'introduction_en',
    globalConstantsResponseTypes.INTRODUCTION_EN_REQUIRED
  ).notEmpty(),

  check(
    'buyNow_tc',
    globalConstantsResponseTypes.BUYNOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'buyNow_sc',
    globalConstantsResponseTypes.BUYNOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'buyNow_en',
    globalConstantsResponseTypes.BUYNOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'participating_tc',
    globalConstantsResponseTypes.PARTICIPATING_TC_REQUIRED
  ).notEmpty(),
  check(
    'participating_sc',
    globalConstantsResponseTypes.PARTICIPATING_SC_REQUIRED
  ).notEmpty(),
  check(
    'participating_en',
    globalConstantsResponseTypes.PARTICIPATING_EN_REQUIRED
  ).notEmpty(),

  check('role_tc', globalConstantsResponseTypes.ROLE_TC_REQUIRED).notEmpty(),
  check('role_sc', globalConstantsResponseTypes.ROLE_SC_REQUIRED).notEmpty(),
  check('role_en', globalConstantsResponseTypes.ROLE_EN_REQUIRED).notEmpty(),

  check(
    'studentShow_tc',
    globalConstantsResponseTypes.STUDENTSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'studentShow_sc',
    globalConstantsResponseTypes.STUDENTSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'studentShow_en',
    globalConstantsResponseTypes.STUDENTSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'nextSchedule_tc',
    globalConstantsResponseTypes.NEXTSCHEDULE_TC_REQUIRED
  ).notEmpty(),
  check(
    'nextSchedule_sc',
    globalConstantsResponseTypes.NEXTSCHEDULE_SC_REQUIRED
  ).notEmpty(),
  check(
    'nextSchedule_en',
    globalConstantsResponseTypes.NEXTSCHEDULE_EN_REQUIRED
  ).notEmpty(),

  check(
    'leaveContact_tc',
    globalConstantsResponseTypes.LEAVECONTACT_TC_REQUIRED
  ).notEmpty(),
  check(
    'leaveContact_sc',
    globalConstantsResponseTypes.LEAVECONTACT_SC_REQUIRED
  ).notEmpty(),
  check(
    'leaveContact_en',
    globalConstantsResponseTypes.LEAVECONTACT_EN_REQUIRED
  ).notEmpty(),

  check(
    'publicShow_tc',
    globalConstantsResponseTypes.PUBLICSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'publicShow_sc',
    globalConstantsResponseTypes.PUBLICSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'publicShow_en',
    globalConstantsResponseTypes.PUBLICSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'programOfShow_tc',
    globalConstantsResponseTypes.PROGRAMOFSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'programOfShow_sc',
    globalConstantsResponseTypes.PROGRAMOFSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'programOfShow_en',
    globalConstantsResponseTypes.PROGRAMOFSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'total1_tc',
    globalConstantsResponseTypes.TOTAL1_TC_REQUIRED
  ).notEmpty(),
  check(
    'total1_sc',
    globalConstantsResponseTypes.TOTAL1_SC_REQUIRED
  ).notEmpty(),
  check(
    'total1_en',
    globalConstantsResponseTypes.TOTAL1_EN_REQUIRED
  ).notEmpty(),

  check(
    'total2_tc',
    globalConstantsResponseTypes.TOTAL2_TC_REQUIRED
  ).notEmpty(),
  check(
    'total2_sc',
    globalConstantsResponseTypes.TOTAL2_SC_REQUIRED
  ).notEmpty(),
  check(
    'total2_en',
    globalConstantsResponseTypes.TOTAL2_EN_REQUIRED
  ).notEmpty(),

  check('about_tc', globalConstantsResponseTypes.ABOUT_TC_REQUIRED).notEmpty(),
  check('about_sc', globalConstantsResponseTypes.ABOUT_SC_REQUIRED).notEmpty(),
  check('about_en', globalConstantsResponseTypes.ABOUT_EN_REQUIRED).notEmpty(),

  check('map_tc', globalConstantsResponseTypes.MAP_TC_REQUIRED).notEmpty(),
  check('map_sc', globalConstantsResponseTypes.MAP_SC_REQUIRED).notEmpty(),
  check('map_en', globalConstantsResponseTypes.MAP_EN_REQUIRED).notEmpty(),

  check(
    'traffic_tc',
    globalConstantsResponseTypes.TRAFFIC_TC_REQUIRED
  ).notEmpty(),
  check(
    'traffic_sc',
    globalConstantsResponseTypes.TRAFFIC_SC_REQUIRED
  ).notEmpty(),
  check(
    'traffic_en',
    globalConstantsResponseTypes.TRAFFIC_EN_REQUIRED
  ).notEmpty(),

  check(
    'contact_tc',
    globalConstantsResponseTypes.CONTACT_TC_REQUIRED
  ).notEmpty(),
  check(
    'contact_sc',
    globalConstantsResponseTypes.CONTACT_SC_REQUIRED
  ).notEmpty(),
  check(
    'contact_en',
    globalConstantsResponseTypes.CONTACT_EN_REQUIRED
  ).notEmpty(),

  check(
    'website_tc',
    globalConstantsResponseTypes.WEBSITE_TC_REQUIRED
  ).notEmpty(),
  check(
    'website_sc',
    globalConstantsResponseTypes.WEBSITE_SC_REQUIRED
  ).notEmpty(),
  check(
    'website_en',
    globalConstantsResponseTypes.WEBSITE_EN_REQUIRED
  ).notEmpty(),

  check(
    'contactInfo_tc',
    globalConstantsResponseTypes.CONTACTINFO_TC_REQUIRED
  ).notEmpty(),
  check(
    'contactInfo_sc',
    globalConstantsResponseTypes.CONTACTINFO_SC_REQUIRED
  ).notEmpty(),
  check(
    'contactInfo_en',
    globalConstantsResponseTypes.CONTACTINFO_EN_REQUIRED
  ).notEmpty(),

  check('tel_tc', globalConstantsResponseTypes.TEL_TC_REQUIRED).notEmpty(),
  check('tel_sc', globalConstantsResponseTypes.TEL_SC_REQUIRED).notEmpty(),
  check('tel_en', globalConstantsResponseTypes.TEL_EN_REQUIRED).notEmpty(),

  check('fax_tc', globalConstantsResponseTypes.FAX_TC_REQUIRED).notEmpty(),
  check('fax_sc', globalConstantsResponseTypes.FAX_SC_REQUIRED).notEmpty(),
  check('fax_en', globalConstantsResponseTypes.FAX_EN_REQUIRED).notEmpty(),

  check('email_tc', globalConstantsResponseTypes.EMAIL_TC_REQUIRED).notEmpty(),
  check('email_sc', globalConstantsResponseTypes.EMAIL_SC_REQUIRED).notEmpty(),
  check('email_en', globalConstantsResponseTypes.EMAIL_EN_REQUIRED).notEmpty(),

  check(
    'researchAndEducation_tc',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_TC_REQUIRED
  ).notEmpty(),
  check(
    'researchAndEducation_sc',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_SC_REQUIRED
  ).notEmpty(),
  check(
    'researchAndEducation_en',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_EN_REQUIRED
  ).notEmpty(),

  check(
    'guidedTalk_tc',
    globalConstantsResponseTypes.GUIDED_TALK_TC_REQUIRED
  ).notEmpty(),
  check(
    'guidedTalk_sc',
    globalConstantsResponseTypes.GUIDED_TALK_SC_REQUIRED
  ).notEmpty(),
  check(
    'guidedTalk_en',
    globalConstantsResponseTypes.GUIDED_TALK_EN_REQUIRED
  ).notEmpty(),

  check(
    'youthProgramme_tc',
    globalConstantsResponseTypes.YOUTH_PROGRAMME_TC_REQUIRED
  ).notEmpty(),
  check(
    'youthProgramme_sc',
    globalConstantsResponseTypes.YOUTH_PROGRAMME_SC_REQUIRED
  ).notEmpty(),
  check(
    'youthProgramme_en',
    globalConstantsResponseTypes.YOUTH_PROGRAMME_EN_REQUIRED
  ).notEmpty(),

  check(
    'cantoneseOperaKnowledge_tc',
    globalConstantsResponseTypes.CANTONESE_OPERA_KNOWLEDGE_TC_REQUIRED
  ).notEmpty(),
  check(
    'cantoneseOperaKnowledge_sc',
    globalConstantsResponseTypes.CANTONESE_OPERA_KNOWLEDGE_SC_REQUIRED
  ).notEmpty(),
  check(
    'cantoneseOperaKnowledge_en',
    globalConstantsResponseTypes.CANTONESE_OPERA_KNOWLEDGE_EN_REQUIRED
  ).notEmpty(),

  check(
    'communityPerformance_tc',
    globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_TC_REQUIRED
  ).notEmpty(),
  check(
    'communityPerformance_sc',
    globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_SC_REQUIRED
  ).notEmpty(),
  check(
    'communityPerformance_en',
    globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_EN_REQUIRED
  ).notEmpty(),

  // check(
  //   'collegeShow_tc',
  //   globalConstantsResponseTypes.COLLEGE_SHOW_TC_REQUIRED
  // ).notEmpty(),
  // check(
  //   'collegeShow_sc',
  //   globalConstantsResponseTypes.COLLEGE_SHOW_SC_REQUIRED
  // ).notEmpty(),
  // check(
  //   'collegeShow_en',
  //   globalConstantsResponseTypes.COLLEGE_SHOW_EN_REQUIRED
  // ).notEmpty(),

  check(
    'exhibition_tc',
    globalConstantsResponseTypes.EXHIBITION_TC_REQUIRED
  ).notEmpty(),
  check(
    'exhibition_sc',
    globalConstantsResponseTypes.EXHIBITION_SC_REQUIRED
  ).notEmpty(),
  check(
    'exhibition_en',
    globalConstantsResponseTypes.EXHIBITION_EN_REQUIRED
  ).notEmpty(),

  check(
    'details_tc',
    globalConstantsResponseTypes.DETAILS_TC_REQUIRED
  ).notEmpty(),
  check(
    'details_sc',
    globalConstantsResponseTypes.DETAILS_SC_REQUIRED
  ).notEmpty(),
  check(
    'details_en',
    globalConstantsResponseTypes.DETAILS_EN_REQUIRED
  ).notEmpty(),

  check(
    'dateOfShow_tc',
    globalConstantsResponseTypes.DATEOFSHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'dateOfShow_sc',
    globalConstantsResponseTypes.DATEOFSHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'dateOfShow_en',
    globalConstantsResponseTypes.DATEOFSHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'location_tc',
    globalConstantsResponseTypes.LOCATION_TC_REQUIRED
  ).notEmpty(),
  check(
    'location_sc',
    globalConstantsResponseTypes.LOCATION_SC_REQUIRED
  ).notEmpty(),
  check(
    'location_en',
    globalConstantsResponseTypes.LOCATION_EN_REQUIRED
  ).notEmpty(),

  check('news_tc', globalConstantsResponseTypes.NEWS_TC_REQUIRED).notEmpty(),
  check('news_sc', globalConstantsResponseTypes.NEWS_SC_REQUIRED).notEmpty(),
  check('news_en', globalConstantsResponseTypes.NEWS_EN_REQUIRED).notEmpty(),

  check(
    'relatedNews_tc',
    globalConstantsResponseTypes.RELATEDNEWS_TC_REQUIRED
  ).notEmpty(),
  check(
    'relatedNews_sc',
    globalConstantsResponseTypes.RELATEDNEWS_SC_REQUIRED
  ).notEmpty(),
  check(
    'relatedNews_en',
    globalConstantsResponseTypes.RELATEDNEWS_EN_REQUIRED
  ).notEmpty(),

  check(
    'ticketInfo_tc',
    globalConstantsResponseTypes.TICKETINFO_TC_REQUIRED
  ).notEmpty(),
  check(
    'ticketInfo_sc',
    globalConstantsResponseTypes.TICKETINFO_SC_REQUIRED
  ).notEmpty(),
  check(
    'ticketInfo_en',
    globalConstantsResponseTypes.TICKETINFO_EN_REQUIRED
  ).notEmpty(),

  check('venue_tc', globalConstantsResponseTypes.VENUE_TC_REQUIRED).notEmpty(),
  check('venue_sc', globalConstantsResponseTypes.VENUE_SC_REQUIRED).notEmpty(),
  check('venue_en', globalConstantsResponseTypes.VENUE_EN_REQUIRED).notEmpty(),

  check(
    'ticketPrice_tc',
    globalConstantsResponseTypes.TICKETPRICE_TC_REQUIRED
  ).notEmpty(),
  check(
    'ticketPrice_sc',
    globalConstantsResponseTypes.TICKETPRICE_SC_REQUIRED
  ).notEmpty(),
  check(
    'ticketPrice_en',
    globalConstantsResponseTypes.TICKETPRICE_EN_REQUIRED
  ).notEmpty(),

  check(
    'ticketWebsite_tc',
    globalConstantsResponseTypes.TICKETWEBSITE_TC_REQUIRED
  ).notEmpty(),
  check(
    'ticketWebsite_sc',
    globalConstantsResponseTypes.TICKETWEBSITE_SC_REQUIRED
  ).notEmpty(),
  check(
    'ticketWebsite_en',
    globalConstantsResponseTypes.TICKETWEBSITE_EN_REQUIRED
  ).notEmpty(),

  check('barwo_tc', globalConstantsResponseTypes.BARWO_TC_REQUIRED).notEmpty(),
  check('barwo_sc', globalConstantsResponseTypes.BARWO_SC_REQUIRED).notEmpty(),
  check('barwo_en', globalConstantsResponseTypes.BARWO_EN_REQUIRED).notEmpty(),

  check('plan_tc', globalConstantsResponseTypes.PLAN_TC_REQUIRED).notEmpty(),
  check('plan_sc', globalConstantsResponseTypes.PLAN_SC_REQUIRED).notEmpty(),
  check('plan_en', globalConstantsResponseTypes.PLAN_EN_REQUIRED).notEmpty(),

  check(
    'admins_tc',
    globalConstantsResponseTypes.ADMINS_TC_REQUIRED
  ).notEmpty(),
  check(
    'admins_sc',
    globalConstantsResponseTypes.ADMINS_SC_REQUIRED
  ).notEmpty(),
  check(
    'admins_en',
    globalConstantsResponseTypes.ADMINS_EN_REQUIRED
  ).notEmpty(),

  check(
    'productionPersons_tc',
    globalConstantsResponseTypes.PRODUCTIONPERSONS_TC_REQUIRED
  ).notEmpty(),
  check(
    'productionPersons_sc',
    globalConstantsResponseTypes.PRODUCTIONPERSONS_SC_REQUIRED
  ).notEmpty(),
  check(
    'productionPersons_en',
    globalConstantsResponseTypes.PRODUCTIONPERSONS_EN_REQUIRED
  ).notEmpty(),

  check(
    'organizer_tc',
    globalConstantsResponseTypes.ORGANIZER_TC_REQUIRED
  ).notEmpty(),
  check(
    'organizer_sc',
    globalConstantsResponseTypes.ORGANIZER_SC_REQUIRED
  ).notEmpty(),
  check(
    'organizer_en',
    globalConstantsResponseTypes.ORGANIZER_EN_REQUIRED
  ).notEmpty(),

  check(
    'sponsor_tc',
    globalConstantsResponseTypes.SPONSOR_TC_REQUIRED
  ).notEmpty(),
  check(
    'sponsor_sc',
    globalConstantsResponseTypes.SPONSOR_SC_REQUIRED
  ).notEmpty(),
  check(
    'sponsor_en',
    globalConstantsResponseTypes.SPONSOR_EN_REQUIRED
  ).notEmpty(),

  check(
    'search_tc',
    globalConstantsResponseTypes.SEARCH_TC_REQUIRED
  ).notEmpty(),
  check(
    'search_sc',
    globalConstantsResponseTypes.SEARCH_SC_REQUIRED
  ).notEmpty(),
  check(
    'search_en',
    globalConstantsResponseTypes.SEARCH_EN_REQUIRED
  ).notEmpty(),

  check(
    'activity_tc',
    globalConstantsResponseTypes.ACTIVITY_TC_REQUIRED
  ).notEmpty(),
  check(
    'activity_sc',
    globalConstantsResponseTypes.ACTIVITY_SC_REQUIRED
  ).notEmpty(),
  check(
    'activity_en',
    globalConstantsResponseTypes.ACTIVITY_EN_REQUIRED
  ).notEmpty(),

  check('event_tc', globalConstantsResponseTypes.EVENT_TC_REQUIRED).notEmpty(),
  check('event_sc', globalConstantsResponseTypes.EVENT_SC_REQUIRED).notEmpty(),
  check('event_en', globalConstantsResponseTypes.EVENT_EN_REQUIRED).notEmpty(),

  check(
    'SPECIAL_NOTICE_tc',
    globalConstantsResponseTypes.SPECIAL_NOTICE_TC_REQUIRED
  ).notEmpty(),
  check(
    'SPECIAL_NOTICE_sc',
    globalConstantsResponseTypes.SPECIAL_NOTICE_SC_REQUIRED
  ).notEmpty(),
  check(
    'SPECIAL_NOTICE_en',
    globalConstantsResponseTypes.SPECIAL_NOTICE_EN_REQUIRED
  ).notEmpty(),

  check(
    'PRESS_RELEASE_tc',
    globalConstantsResponseTypes.PRESS_RELEASE_TC_REQUIRED
  ).notEmpty(),
  check(
    'PRESS_RELEASE_sc',
    globalConstantsResponseTypes.PRESS_RELEASE_SC_REQUIRED
  ).notEmpty(),
  check(
    'PRESS_RELEASE_en',
    globalConstantsResponseTypes.PRESS_RELEASE_EN_REQUIRED
  ).notEmpty(),

  check(
    'INTERVIEW_tc',
    globalConstantsResponseTypes.INTERVIEW_TC_REQUIRED
  ).notEmpty(),
  check(
    'INTERVIEW_sc',
    globalConstantsResponseTypes.INTERVIEW_SC_REQUIRED
  ).notEmpty(),
  check(
    'INTERVIEW_en',
    globalConstantsResponseTypes.INTERVIEW_EN_REQUIRED
  ).notEmpty(),

  check(
    'newsmedia_tc',
    globalConstantsResponseTypes.NEWSMEDIA_TC_REQUIRED
  ).notEmpty(),
  check(
    'newsmedia_sc',
    globalConstantsResponseTypes.NEWSMEDIA_SC_REQUIRED
  ).notEmpty(),
  check(
    'newsmedia_en',
    globalConstantsResponseTypes.NEWSMEDIA_EN_REQUIRED
  ).notEmpty(),

  check(
    'newsletter_tc',
    globalConstantsResponseTypes.NEWSLETTER_TC_REQUIRED
  ).notEmpty(),
  check(
    'newsletter_sc',
    globalConstantsResponseTypes.NEWSLETTER_SC_REQUIRED
  ).notEmpty(),
  check(
    'newsletter_en',
    globalConstantsResponseTypes.NEWSLETTER_EN_REQUIRED
  ).notEmpty(),

  check(
    'EMAIL_SUCCESS_tc',
    globalConstantsResponseTypes.EMAIL_SUCCESS_TC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_SUCCESS_sc',
    globalConstantsResponseTypes.EMAIL_SUCCESS_SC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_SUCCESS_en',
    globalConstantsResponseTypes.EMAIL_SUCCESS_EN_REQUIRED
  ).notEmpty(),

  check(
    'EMAIL_ADDRESS_INVALID_tc',
    globalConstantsResponseTypes.EMAIL_ADDRESS_INVALID_TC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_ADDRESS_INVALID_sc',
    globalConstantsResponseTypes.EMAIL_ADDRESS_INVALID_SC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_ADDRESS_INVALID_en',
    globalConstantsResponseTypes.EMAIL_ADDRESS_INVALID_EN_REQUIRED
  ).notEmpty(),

  check(
    'EMAIL_ADDRESS_ALREADY_EXISTS_tc',
    globalConstantsResponseTypes.EMAIL_ADDRESS_ALREADY_EXISTS_TC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_ADDRESS_ALREADY_EXISTS_sc',
    globalConstantsResponseTypes.EMAIL_ADDRESS_ALREADY_EXISTS_SC_REQUIRED
  ).notEmpty(),
  check(
    'EMAIL_ADDRESS_ALREADY_EXISTS_en',
    globalConstantsResponseTypes.EMAIL_ADDRESS_ALREADY_EXISTS_EN_REQUIRED
  ).notEmpty(),

  check(
    'subscribeMsg_tc',
    globalConstantsResponseTypes.SUBSCRIBE_MSG_TC_REQUIRED
  ).notEmpty(),
  check(
    'subscribeMsg_sc',
    globalConstantsResponseTypes.SUBSCRIBE_MSG_SC_REQUIRED
  ).notEmpty(),
  check(
    'subscribeMsg_en',
    globalConstantsResponseTypes.SUBSCRIBE_MSG_EN_REQUIRED
  ).notEmpty(),

  check(
    'contactus_tc',
    globalConstantsResponseTypes.CONTACTUS_TC_REQUIRED
  ).notEmpty(),
  check(
    'contactus_sc',
    globalConstantsResponseTypes.CONTACTUS_SC_REQUIRED
  ).notEmpty(),
  check(
    'contactus_en',
    globalConstantsResponseTypes.CONTACTUS_EN_REQUIRED
  ).notEmpty(),

  check(
    'pastEvents_tc',
    globalConstantsResponseTypes.PAST_EVENTS_TC_REQUIRED
  ).notEmpty(),
  check(
    'pastEvents_sc',
    globalConstantsResponseTypes.PAST_EVENTS_SC_REQUIRED
  ).notEmpty(),
  check(
    'pastEvents_en',
    globalConstantsResponseTypes.PAST_EVENTS_EN_REQUIRED
  ).notEmpty(),

  check(
    'termsAndConditions_tc',
    globalConstantsResponseTypes.TERMS_AND_CONDITIONS_TC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditions_sc',
    globalConstantsResponseTypes.TERMS_AND_CONDITIONS_SC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditions_en',
    globalConstantsResponseTypes.TERMS_AND_CONDITIONS_EN_REQUIRED
  ).notEmpty(),

  check(
    'copyright_tc',
    globalConstantsResponseTypes.COPYRIGHT_TC_REQUIRED
  ).notEmpty(),
  check(
    'copyright_sc',
    globalConstantsResponseTypes.COPYRIGHT_SC_REQUIRED
  ).notEmpty(),
  check(
    'copyright_en',
    globalConstantsResponseTypes.COPYRIGHT_EN_REQUIRED
  ).notEmpty(),

  check(
    'artistInfo_tc',
    globalConstantsResponseTypes.ARTIST_INFO_TC_REQUIRED
  ).notEmpty(),
  check(
    'artistInfo_sc',
    globalConstantsResponseTypes.ARTIST_INFO_SC_REQUIRED
  ).notEmpty(),
  check(
    'artistInfo_en',
    globalConstantsResponseTypes.ARTIST_INFO_EN_REQUIRED
  ).notEmpty(),

  // check(
  //   'communityPerformanceIndicator_tc',
  //   globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_INDICATOR_TC_REQUIRED
  // ).notEmpty(),
  // check(
  //   'communityPerformanceIndicator_sc',
  //   globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_INDICATOR_SC_REQUIRED
  // ).notEmpty(),
  // check(
  //   'communityPerformanceIndicator_en',
  //   globalConstantsResponseTypes.COMMUNITY_PERFORMANCE_INDICATOR_EN_REQUIRED
  // ).notEmpty(),

  check(
    'otherShow_tc',
    globalConstantsResponseTypes.OTHER_SHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'otherShow_sc',
    globalConstantsResponseTypes.OTHER_SHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'otherShow_en',
    globalConstantsResponseTypes.OTHER_SHOW_EN_REQUIRED
  ).notEmpty(),

  check('sound_tc', globalConstantsResponseTypes.SOUND_TC_REQUIRED).notEmpty(),
  check('sound_sc', globalConstantsResponseTypes.SOUND_SC_REQUIRED).notEmpty(),
  check('sound_en', globalConstantsResponseTypes.SOUND_EN_REQUIRED).notEmpty(),

  check(
    'searching_tc',
    globalConstantsResponseTypes.SEARCHING_TC_REQUIRED
  ).notEmpty(),
  check(
    'searching_sc',
    globalConstantsResponseTypes.SEARCHING_SC_REQUIRED
  ).notEmpty(),
  check(
    'searching_en',
    globalConstantsResponseTypes.SEARCHING_EN_REQUIRED
  ).notEmpty(),

  check(
    'notfound_tc',
    globalConstantsResponseTypes.NOTFOUND_TC_REQUIRED
  ).notEmpty(),
  check(
    'notfound_sc',
    globalConstantsResponseTypes.NOTFOUND_SC_REQUIRED
  ).notEmpty(),
  check(
    'notfound_en',
    globalConstantsResponseTypes.NOTFOUND_EN_REQUIRED
  ).notEmpty(),

  check(
    'found1_tc',
    globalConstantsResponseTypes.FOUND1_TC_REQUIRED
  ).notEmpty(),
  check(
    'found1_sc',
    globalConstantsResponseTypes.FOUND1_SC_REQUIRED
  ).notEmpty(),
  check(
    'found1_en',
    globalConstantsResponseTypes.FOUND1_EN_REQUIRED
  ).notEmpty(),

  check(
    'found2_tc',
    globalConstantsResponseTypes.FOUND2_TC_REQUIRED
  ).notEmpty(),
  check(
    'found2_sc',
    globalConstantsResponseTypes.FOUND2_SC_REQUIRED
  ).notEmpty(),
  check(
    'found2_en',
    globalConstantsResponseTypes.FOUND2_EN_REQUIRED
  ).notEmpty(),

  check(
    'galleryOfShow_tc',
    globalConstantsResponseTypes.GALLERY_OF_SHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'galleryOfShow_sc',
    globalConstantsResponseTypes.GALLERY_OF_SHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'galleryOfShow_en',
    globalConstantsResponseTypes.GALLERY_OF_SHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'exhibitionImages_tc',
    globalConstantsResponseTypes.EXHIBITION_IMAGES_TC_REQUIRED
  ).notEmpty(),
  check(
    'exhibitionImages_sc',
    globalConstantsResponseTypes.EXHIBITION_IMAGES_SC_REQUIRED
  ).notEmpty(),
  check(
    'exhibitionImages_en',
    globalConstantsResponseTypes.EXHIBITION_IMAGES_EN_REQUIRED
  ).notEmpty(),

  check(
    'page404Message_tc',
    globalConstantsResponseTypes.PAGE_404_MESSAGE_TC_REQUIRED
  ).notEmpty(),
  check(
    'page404Message_sc',
    globalConstantsResponseTypes.PAGE_404_MESSAGE_SC_REQUIRED
  ).notEmpty(),
  check(
    'page404Message_en',
    globalConstantsResponseTypes.PAGE_404_MESSAGE_EN_REQUIRED
  ).notEmpty(),

  check('media_tc', globalConstantsResponseTypes.MEDIA_TC_REQUIRED).notEmpty(),
  check('media_sc', globalConstantsResponseTypes.MEDIA_SC_REQUIRED).notEmpty(),
  check('media_en', globalConstantsResponseTypes.MEDIA_EN_REQUIRED).notEmpty(),

  check(
    'privacypolicies_tc',
    globalConstantsResponseTypes.PRIVACYPOLICIES_TC_REQUIRED
  ).notEmpty(),
  check(
    'privacypolicies_sc',
    globalConstantsResponseTypes.PRIVACYPOLICIES_SC_REQUIRED
  ).notEmpty(),
  check(
    'privacypolicies_en',
    globalConstantsResponseTypes.PRIVACYPOLICIES_EN_REQUIRED
  ).notEmpty(),

  check('date_tc', globalConstantsResponseTypes.DATE_TC_REQUIRED).notEmpty(),
  check('date_sc', globalConstantsResponseTypes.DATE_SC_REQUIRED).notEmpty(),
  check('date_en', globalConstantsResponseTypes.DATE_EN_REQUIRED).notEmpty(),

  check(
    'scriptArrangement_tc',
    globalConstantsResponseTypes.SCRIPT_ARRANGEMENT_TC_REQUIRED
  ).notEmpty(),
  check(
    'scriptArrangement_sc',
    globalConstantsResponseTypes.SCRIPT_ARRANGEMENT_SC_REQUIRED
  ).notEmpty(),
  check(
    'scriptArrangement_en',
    globalConstantsResponseTypes.SCRIPT_ARRANGEMENT_EN_REQUIRED
  ).notEmpty(),

  check(
    'viewOurTeam_tc',
    globalConstantsResponseTypes.VIEW_OUR_TEAM_TC_REQUIRED
  ).notEmpty(),
  check(
    'viewOurTeam_sc',
    globalConstantsResponseTypes.VIEW_OUR_TEAM_SC_REQUIRED
  ).notEmpty(),
  check(
    'viewOurTeam_en',
    globalConstantsResponseTypes.VIEW_OUR_TEAM_EN_REQUIRED
  ).notEmpty(),

  check(
    'photos_tc',
    globalConstantsResponseTypes.PHOTOS_TC_REQUIRED
  ).notEmpty(),
  check(
    'photos_sc',
    globalConstantsResponseTypes.PHOTOS_SC_REQUIRED
  ).notEmpty(),
  check(
    'photos_en',
    globalConstantsResponseTypes.PHOTOS_EN_REQUIRED
  ).notEmpty(),

  check(
    'videos_tc',
    globalConstantsResponseTypes.VIDEOS_TC_REQUIRED
  ).notEmpty(),
  check(
    'videos_sc',
    globalConstantsResponseTypes.VIDEOS_SC_REQUIRED
  ).notEmpty(),
  check('videos_en', globalConstantsResponseTypes.VIDEOS_EN_REQUIRED).notEmpty()
];

/* end of utilities */

// @route   GET api/backend/globalConstants/globalConstants
// @desc    Get Global Constants
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const globalConstants = await GlobalConstants.findOne({})
      .select(globalConstantsSelect)
      .populate(globalConstantsPopulationList);
    if (!globalConstants) {
      return res.status(404).json({
        errors: [globalConstantsResponseTypes.GLOBAL_CONSTANTS_NOT_EXISTS]
      });
    }
    res.json(globalConstants);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/backend/globalConstants/globalConstants
// @desc    Add or update Global Constants
// @access  Private
router.post(
  '/',
  [auth, globalConstantsValidationChecks, validationHandling],
  async (req, res) => {
    const {
      latestShow_tc,
      latestShow_sc,
      latestShow_en,

      latestShowIcon1_tc,
      latestShowIcon1_sc,
      latestShowIcon1_en,

      latestShowIcon2_tc,
      latestShowIcon2_sc,
      latestShowIcon2_en,

      scheduleOfShow_tc,
      scheduleOfShow_sc,
      scheduleOfShow_en,

      teams_tc,
      teams_sc,
      teams_en,

      artDirector_tc,
      artDirector_sc,
      artDirector_en,

      actor_tc,
      actor_sc,
      actor_en,

      artist_tc,
      artist_sc,
      artist_en,

      detailsOfShow_tc,
      detailsOfShow_sc,
      detailsOfShow_en,

      show_tc,
      show_sc,
      show_en,

      allShow_tc,
      allShow_sc,
      allShow_en,

      activities_tc,
      activities_sc,
      activities_en,

      downloadPDF_tc,
      downloadPDF_sc,
      downloadPDF_en,

      ourActors_tc,
      ourActors_sc,
      ourActors_en,

      ymtTheater_tc,
      ymtTheater_sc,
      ymtTheater_en,

      followUs_tc,
      followUs_sc,
      followUs_en,

      all_tc,
      all_sc,
      all_en,

      boy_tc,
      boy_sc,
      boy_en,

      girl_tc,
      girl_sc,
      girl_en,

      inherit_tc,
      inherit_sc,
      inherit_en,

      share_tc,
      share_sc,
      share_en,

      relatedShow_tc,
      relatedShow_sc,
      relatedShow_en,

      relatedArtists_tc,
      relatedArtists_sc,
      relatedArtists_en,

      relatedDrama_tc,
      relatedDrama_sc,
      relatedDrama_en,

      allShows_tc,
      allShows_sc,
      allShows_en,

      more_tc,
      more_sc,
      more_en,

      scenarist_tc,
      scenarist_sc,
      scenarist_en,

      introduction_tc,
      introduction_sc,
      introduction_en,

      buyNow_tc,
      buyNow_sc,
      buyNow_en,

      participating_tc,
      participating_sc,
      participating_en,

      role_tc,
      role_sc,
      role_en,

      studentShow_tc,
      studentShow_sc,
      studentShow_en,

      nextSchedule_tc,
      nextSchedule_sc,
      nextSchedule_en,

      leaveContact_tc,
      leaveContact_sc,
      leaveContact_en,

      publicShow_tc,
      publicShow_sc,
      publicShow_en,

      programOfShow_tc,
      programOfShow_sc,
      programOfShow_en,

      total1_tc,
      total1_sc,
      total1_en,

      total2_tc,
      total2_sc,
      total2_en,

      about_tc,
      about_sc,
      about_en,

      map_tc,
      map_sc,
      map_en,

      traffic_tc,
      traffic_sc,
      traffic_en,

      contact_tc,
      contact_sc,
      contact_en,

      website_tc,
      website_sc,
      website_en,

      contactInfo_tc,
      contactInfo_sc,
      contactInfo_en,

      tel_tc,
      tel_sc,
      tel_en,

      fax_tc,
      fax_sc,
      fax_en,

      email_tc,
      email_sc,
      email_en,

      researchAndEducation_tc,
      researchAndEducation_sc,
      researchAndEducation_en,

      guidedTalk_tc,
      guidedTalk_sc,
      guidedTalk_en,

      youthProgramme_tc,
      youthProgramme_sc,
      youthProgramme_en,

      cantoneseOperaKnowledge_tc,
      cantoneseOperaKnowledge_sc,
      cantoneseOperaKnowledge_en,

      communityPerformance_tc,
      communityPerformance_sc,
      communityPerformance_en,
      // collegeShow_tc,
      // collegeShow_sc,
      // collegeShow_en,

      exhibition_tc,
      exhibition_sc,
      exhibition_en,

      details_tc,
      details_sc,
      details_en,

      dateOfShow_tc,
      dateOfShow_sc,
      dateOfShow_en,

      location_tc,
      location_sc,
      location_en,

      news_tc,
      news_sc,
      news_en,

      relatedNews_tc,
      relatedNews_sc,
      relatedNews_en,

      ticketInfo_tc,
      ticketInfo_sc,
      ticketInfo_en,

      venue_tc,
      venue_sc,
      venue_en,

      ticketPrice_tc,
      ticketPrice_sc,
      ticketPrice_en,

      ticketWebsite_tc,
      ticketWebsite_sc,
      ticketWebsite_en,

      barwo_tc,
      barwo_sc,
      barwo_en,

      plan_tc,
      plan_sc,
      plan_en,

      admins_tc,
      admins_sc,
      admins_en,

      productionPersons_tc,
      productionPersons_sc,
      productionPersons_en,

      organizer_tc,
      organizer_sc,
      organizer_en,

      sponsor_tc,
      sponsor_sc,
      sponsor_en,

      search_tc,
      search_sc,
      search_en,

      activity_tc,
      activity_sc,
      activity_en,

      event_tc,
      event_sc,
      event_en,

      SPECIAL_NOTICE_tc,
      SPECIAL_NOTICE_sc,
      SPECIAL_NOTICE_en,

      PRESS_RELEASE_tc,
      PRESS_RELEASE_sc,
      PRESS_RELEASE_en,

      INTERVIEW_tc,
      INTERVIEW_sc,
      INTERVIEW_en,

      newsmedia_tc,
      newsmedia_sc,
      newsmedia_en,

      newsletter_tc,
      newsletter_sc,
      newsletter_en,

      EMAIL_SUCCESS_tc,
      EMAIL_SUCCESS_sc,
      EMAIL_SUCCESS_en,

      EMAIL_ADDRESS_INVALID_tc,
      EMAIL_ADDRESS_INVALID_sc,
      EMAIL_ADDRESS_INVALID_en,

      EMAIL_ADDRESS_ALREADY_EXISTS_tc,
      EMAIL_ADDRESS_ALREADY_EXISTS_sc,
      EMAIL_ADDRESS_ALREADY_EXISTS_en,

      subscribeMsg_tc,
      subscribeMsg_sc,
      subscribeMsg_en,

      contactus_tc,
      contactus_sc,
      contactus_en,

      pastEvents_tc,
      pastEvents_sc,
      pastEvents_en,

      termsAndConditions_tc,
      termsAndConditions_sc,
      termsAndConditions_en,

      copyright_tc,
      copyright_sc,
      copyright_en,

      artistInfo_tc,
      artistInfo_sc,
      artistInfo_en,

      // communityPerformanceIndicator_tc,
      // communityPerformanceIndicator_sc,
      // communityPerformanceIndicator_en,

      otherShow_tc,
      otherShow_sc,
      otherShow_en,

      sound_tc,
      sound_sc,
      sound_en,

      searching_tc,
      searching_sc,
      searching_en,

      notfound_tc,
      notfound_sc,
      notfound_en,

      found1_tc,
      found1_sc,
      found1_en,

      found2_tc,
      found2_sc,
      found2_en,

      galleryOfShow_tc,
      galleryOfShow_sc,
      galleryOfShow_en,

      exhibitionImages_tc,
      exhibitionImages_sc,
      exhibitionImages_en,

      page404Message_tc,
      page404Message_sc,
      page404Message_en,

      media_tc,
      media_sc,
      media_en,

      privacypolicies_tc,
      privacypolicies_sc,
      privacypolicies_en,

      date_tc,
      date_sc,
      date_en,

      scriptArrangement_tc,
      scriptArrangement_sc,
      scriptArrangement_en,

      viewOurTeam_tc,
      viewOurTeam_sc,
      viewOurTeam_en,

      photos_tc,
      photos_sc,
      photos_en,

      videos_tc,
      videos_sc,
      videos_en
    } = req.body;

    // Build global constants object
    // Note:
    // non-required fields do not need null check
    const globalConstantsFields = {};
    globalConstantsFields.latestShow_tc = latestShow_tc;
    globalConstantsFields.latestShow_sc = latestShow_sc;
    globalConstantsFields.latestShow_en = latestShow_en;

    globalConstantsFields.latestShowIcon1_tc = latestShowIcon1_tc;
    globalConstantsFields.latestShowIcon1_sc = latestShowIcon1_sc;
    globalConstantsFields.latestShowIcon1_en = latestShowIcon1_en;

    globalConstantsFields.latestShowIcon2_tc = latestShowIcon2_tc;
    globalConstantsFields.latestShowIcon2_sc = latestShowIcon2_sc;
    globalConstantsFields.latestShowIcon2_en = latestShowIcon2_en;

    globalConstantsFields.scheduleOfShow_tc = scheduleOfShow_tc;
    globalConstantsFields.scheduleOfShow_sc = scheduleOfShow_sc;
    globalConstantsFields.scheduleOfShow_en = scheduleOfShow_en;

    globalConstantsFields.teams_tc = teams_tc;
    globalConstantsFields.teams_sc = teams_sc;
    globalConstantsFields.teams_en = teams_en;

    globalConstantsFields.artDirector_tc = artDirector_tc;
    globalConstantsFields.artDirector_sc = artDirector_sc;
    globalConstantsFields.artDirector_en = artDirector_en;

    globalConstantsFields.actor_tc = actor_tc;
    globalConstantsFields.actor_sc = actor_sc;
    globalConstantsFields.actor_en = actor_en;

    globalConstantsFields.artist_tc = artist_tc;
    globalConstantsFields.artist_sc = artist_sc;
    globalConstantsFields.artist_en = artist_en;

    globalConstantsFields.detailsOfShow_tc = detailsOfShow_tc;
    globalConstantsFields.detailsOfShow_sc = detailsOfShow_sc;
    globalConstantsFields.detailsOfShow_en = detailsOfShow_en;

    globalConstantsFields.show_tc = show_tc;
    globalConstantsFields.show_sc = show_sc;
    globalConstantsFields.show_en = show_en;

    globalConstantsFields.allShow_tc = allShow_tc;
    globalConstantsFields.allShow_sc = allShow_sc;
    globalConstantsFields.allShow_en = allShow_en;

    globalConstantsFields.activities_tc = activities_tc;
    globalConstantsFields.activities_sc = activities_sc;
    globalConstantsFields.activities_en = activities_en;

    globalConstantsFields.downloadPDF_tc = downloadPDF_tc;
    globalConstantsFields.downloadPDF_sc = downloadPDF_sc;
    globalConstantsFields.downloadPDF_en = downloadPDF_en;

    globalConstantsFields.ourActors_tc = ourActors_tc;
    globalConstantsFields.ourActors_sc = ourActors_sc;
    globalConstantsFields.ourActors_en = ourActors_en;

    globalConstantsFields.ymtTheater_tc = ymtTheater_tc;
    globalConstantsFields.ymtTheater_sc = ymtTheater_sc;
    globalConstantsFields.ymtTheater_en = ymtTheater_en;

    globalConstantsFields.followUs_tc = followUs_tc;
    globalConstantsFields.followUs_sc = followUs_sc;
    globalConstantsFields.followUs_en = followUs_en;

    globalConstantsFields.all_tc = all_tc;
    globalConstantsFields.all_sc = all_sc;
    globalConstantsFields.all_en = all_en;

    globalConstantsFields.boy_tc = boy_tc;
    globalConstantsFields.boy_sc = boy_sc;
    globalConstantsFields.boy_en = boy_en;

    globalConstantsFields.girl_tc = girl_tc;
    globalConstantsFields.girl_sc = girl_sc;
    globalConstantsFields.girl_en = girl_en;

    globalConstantsFields.inherit_tc = inherit_tc;
    globalConstantsFields.inherit_sc = inherit_sc;
    globalConstantsFields.inherit_en = inherit_en;

    globalConstantsFields.share_tc = share_tc;
    globalConstantsFields.share_sc = share_sc;
    globalConstantsFields.share_en = share_en;

    globalConstantsFields.relatedShow_tc = relatedShow_tc;
    globalConstantsFields.relatedShow_sc = relatedShow_sc;
    globalConstantsFields.relatedShow_en = relatedShow_en;

    globalConstantsFields.relatedArtists_tc = relatedArtists_tc;
    globalConstantsFields.relatedArtists_sc = relatedArtists_sc;
    globalConstantsFields.relatedArtists_en = relatedArtists_en;

    globalConstantsFields.relatedDrama_tc = relatedDrama_tc;
    globalConstantsFields.relatedDrama_sc = relatedDrama_sc;
    globalConstantsFields.relatedDrama_en = relatedDrama_en;

    globalConstantsFields.allShows_tc = allShows_tc;
    globalConstantsFields.allShows_sc = allShows_sc;
    globalConstantsFields.allShows_en = allShows_en;

    globalConstantsFields.more_tc = more_tc;
    globalConstantsFields.more_sc = more_sc;
    globalConstantsFields.more_en = more_en;

    globalConstantsFields.scenarist_tc = scenarist_tc;
    globalConstantsFields.scenarist_sc = scenarist_sc;
    globalConstantsFields.scenarist_en = scenarist_en;

    globalConstantsFields.introduction_tc = introduction_tc;
    globalConstantsFields.introduction_sc = introduction_sc;
    globalConstantsFields.introduction_en = introduction_en;

    globalConstantsFields.buyNow_tc = buyNow_tc;
    globalConstantsFields.buyNow_sc = buyNow_sc;
    globalConstantsFields.buyNow_en = buyNow_en;

    globalConstantsFields.participating_tc = participating_tc;
    globalConstantsFields.participating_sc = participating_sc;
    globalConstantsFields.participating_en = participating_en;

    globalConstantsFields.role_tc = role_tc;
    globalConstantsFields.role_sc = role_sc;
    globalConstantsFields.role_en = role_en;

    globalConstantsFields.studentShow_tc = studentShow_tc;
    globalConstantsFields.studentShow_sc = studentShow_sc;
    globalConstantsFields.studentShow_en = studentShow_en;

    globalConstantsFields.nextSchedule_tc = nextSchedule_tc;
    globalConstantsFields.nextSchedule_sc = nextSchedule_sc;
    globalConstantsFields.nextSchedule_en = nextSchedule_en;

    globalConstantsFields.leaveContact_tc = leaveContact_tc;
    globalConstantsFields.leaveContact_sc = leaveContact_sc;
    globalConstantsFields.leaveContact_en = leaveContact_en;

    globalConstantsFields.publicShow_tc = publicShow_tc;
    globalConstantsFields.publicShow_sc = publicShow_sc;
    globalConstantsFields.publicShow_en = publicShow_en;

    globalConstantsFields.programOfShow_tc = programOfShow_tc;
    globalConstantsFields.programOfShow_sc = programOfShow_sc;
    globalConstantsFields.programOfShow_en = programOfShow_en;

    globalConstantsFields.total1_tc = total1_tc;
    globalConstantsFields.total1_sc = total1_sc;
    globalConstantsFields.total1_en = total1_en;

    globalConstantsFields.total2_tc = total2_tc;
    globalConstantsFields.total2_sc = total2_sc;
    globalConstantsFields.total2_en = total2_en;

    globalConstantsFields.about_tc = about_tc;
    globalConstantsFields.about_sc = about_sc;
    globalConstantsFields.about_en = about_en;

    globalConstantsFields.map_tc = map_tc;
    globalConstantsFields.map_sc = map_sc;
    globalConstantsFields.map_en = map_en;

    globalConstantsFields.traffic_tc = traffic_tc;
    globalConstantsFields.traffic_sc = traffic_sc;
    globalConstantsFields.traffic_en = traffic_en;

    globalConstantsFields.contact_tc = contact_tc;
    globalConstantsFields.contact_sc = contact_sc;
    globalConstantsFields.contact_en = contact_en;

    globalConstantsFields.website_tc = website_tc;
    globalConstantsFields.website_sc = website_sc;
    globalConstantsFields.website_en = website_en;

    globalConstantsFields.contactInfo_tc = contactInfo_tc;
    globalConstantsFields.contactInfo_sc = contactInfo_sc;
    globalConstantsFields.contactInfo_en = contactInfo_en;

    globalConstantsFields.tel_tc = tel_tc;
    globalConstantsFields.tel_sc = tel_sc;
    globalConstantsFields.tel_en = tel_en;

    globalConstantsFields.fax_tc = fax_tc;
    globalConstantsFields.fax_sc = fax_sc;
    globalConstantsFields.fax_en = fax_en;

    globalConstantsFields.email_tc = email_tc;
    globalConstantsFields.email_sc = email_sc;
    globalConstantsFields.email_en = email_en;

    globalConstantsFields.researchAndEducation_tc = researchAndEducation_tc;
    globalConstantsFields.researchAndEducation_sc = researchAndEducation_sc;
    globalConstantsFields.researchAndEducation_en = researchAndEducation_en;

    globalConstantsFields.guidedTalk_tc = guidedTalk_tc;
    globalConstantsFields.guidedTalk_sc = guidedTalk_sc;
    globalConstantsFields.guidedTalk_en = guidedTalk_en;

    globalConstantsFields.youthProgramme_tc = youthProgramme_tc;
    globalConstantsFields.youthProgramme_sc = youthProgramme_sc;
    globalConstantsFields.youthProgramme_en = youthProgramme_en;

    globalConstantsFields.cantoneseOperaKnowledge_tc = cantoneseOperaKnowledge_tc;
    globalConstantsFields.cantoneseOperaKnowledge_sc = cantoneseOperaKnowledge_sc;
    globalConstantsFields.cantoneseOperaKnowledge_en = cantoneseOperaKnowledge_en;
    
    globalConstantsFields.communityPerformance_tc = communityPerformance_tc;
    globalConstantsFields.communityPerformance_sc = communityPerformance_sc;
    globalConstantsFields.communityPerformance_en = communityPerformance_en;

    

    // globalConstantsFields.collegeShow_tc = collegeShow_tc;
    // globalConstantsFields.collegeShow_sc = collegeShow_sc;
    // globalConstantsFields.collegeShow_en = collegeShow_en;

    globalConstantsFields.exhibition_tc = exhibition_tc;
    globalConstantsFields.exhibition_sc = exhibition_sc;
    globalConstantsFields.exhibition_en = exhibition_en;

    globalConstantsFields.details_tc = details_tc;
    globalConstantsFields.details_sc = details_sc;
    globalConstantsFields.details_en = details_en;

    globalConstantsFields.dateOfShow_tc = dateOfShow_tc;
    globalConstantsFields.dateOfShow_sc = dateOfShow_sc;
    globalConstantsFields.dateOfShow_en = dateOfShow_en;

    globalConstantsFields.location_tc = location_tc;
    globalConstantsFields.location_sc = location_sc;
    globalConstantsFields.location_en = location_en;

    globalConstantsFields.news_tc = news_tc;
    globalConstantsFields.news_sc = news_sc;
    globalConstantsFields.news_en = news_en;

    globalConstantsFields.relatedNews_tc = relatedNews_tc;
    globalConstantsFields.relatedNews_sc = relatedNews_sc;
    globalConstantsFields.relatedNews_en = relatedNews_en;

    globalConstantsFields.ticketInfo_tc = ticketInfo_tc;
    globalConstantsFields.ticketInfo_sc = ticketInfo_sc;
    globalConstantsFields.ticketInfo_en = ticketInfo_en;

    globalConstantsFields.venue_tc = venue_tc;
    globalConstantsFields.venue_sc = venue_sc;
    globalConstantsFields.venue_en = venue_en;

    globalConstantsFields.ticketPrice_tc = ticketPrice_tc;
    globalConstantsFields.ticketPrice_sc = ticketPrice_sc;
    globalConstantsFields.ticketPrice_en = ticketPrice_en;

    globalConstantsFields.ticketWebsite_tc = ticketWebsite_tc;
    globalConstantsFields.ticketWebsite_sc = ticketWebsite_sc;
    globalConstantsFields.ticketWebsite_en = ticketWebsite_en;

    globalConstantsFields.barwo_tc = barwo_tc;
    globalConstantsFields.barwo_sc = barwo_sc;
    globalConstantsFields.barwo_en = barwo_en;

    globalConstantsFields.plan_tc = plan_tc;
    globalConstantsFields.plan_sc = plan_sc;
    globalConstantsFields.plan_en = plan_en;

    globalConstantsFields.admins_tc = admins_tc;
    globalConstantsFields.admins_sc = admins_sc;
    globalConstantsFields.admins_en = admins_en;

    globalConstantsFields.productionPersons_tc = productionPersons_tc;
    globalConstantsFields.productionPersons_sc = productionPersons_sc;
    globalConstantsFields.productionPersons_en = productionPersons_en;

    globalConstantsFields.organizer_tc = organizer_tc;
    globalConstantsFields.organizer_sc = organizer_sc;
    globalConstantsFields.organizer_en = organizer_en;

    globalConstantsFields.sponsor_tc = sponsor_tc;
    globalConstantsFields.sponsor_sc = sponsor_sc;
    globalConstantsFields.sponsor_en = sponsor_en;

    globalConstantsFields.search_tc = search_tc;
    globalConstantsFields.search_sc = search_sc;
    globalConstantsFields.search_en = search_en;

    globalConstantsFields.activity_tc = activity_tc;
    globalConstantsFields.activity_sc = activity_sc;
    globalConstantsFields.activity_en = activity_en;

    globalConstantsFields.event_tc = event_tc;
    globalConstantsFields.event_sc = event_sc;
    globalConstantsFields.event_en = event_en;

    globalConstantsFields.SPECIAL_NOTICE_tc = SPECIAL_NOTICE_tc;
    globalConstantsFields.SPECIAL_NOTICE_sc = SPECIAL_NOTICE_sc;
    globalConstantsFields.SPECIAL_NOTICE_en = SPECIAL_NOTICE_en;

    globalConstantsFields.PRESS_RELEASE_tc = PRESS_RELEASE_tc;
    globalConstantsFields.PRESS_RELEASE_sc = PRESS_RELEASE_sc;
    globalConstantsFields.PRESS_RELEASE_en = PRESS_RELEASE_en;

    globalConstantsFields.INTERVIEW_tc = INTERVIEW_tc;
    globalConstantsFields.INTERVIEW_sc = INTERVIEW_sc;
    globalConstantsFields.INTERVIEW_en = INTERVIEW_en;

    globalConstantsFields.newsmedia_tc = newsmedia_tc;
    globalConstantsFields.newsmedia_sc = newsmedia_sc;
    globalConstantsFields.newsmedia_en = newsmedia_en;

    globalConstantsFields.newsletter_tc = newsletter_tc;
    globalConstantsFields.newsletter_sc = newsletter_sc;
    globalConstantsFields.newsletter_en = newsletter_en;

    globalConstantsFields.EMAIL_SUCCESS_tc = EMAIL_SUCCESS_tc;
    globalConstantsFields.EMAIL_SUCCESS_sc = EMAIL_SUCCESS_sc;
    globalConstantsFields.EMAIL_SUCCESS_en = EMAIL_SUCCESS_en;

    globalConstantsFields.EMAIL_ADDRESS_INVALID_tc = EMAIL_ADDRESS_INVALID_tc;
    globalConstantsFields.EMAIL_ADDRESS_INVALID_sc = EMAIL_ADDRESS_INVALID_sc;
    globalConstantsFields.EMAIL_ADDRESS_INVALID_en = EMAIL_ADDRESS_INVALID_en;

    globalConstantsFields.EMAIL_ADDRESS_ALREADY_EXISTS_tc = EMAIL_ADDRESS_ALREADY_EXISTS_tc;
    globalConstantsFields.EMAIL_ADDRESS_ALREADY_EXISTS_sc = EMAIL_ADDRESS_ALREADY_EXISTS_sc;
    globalConstantsFields.EMAIL_ADDRESS_ALREADY_EXISTS_en = EMAIL_ADDRESS_ALREADY_EXISTS_en;

    globalConstantsFields.subscribeMsg_tc = subscribeMsg_tc;
    globalConstantsFields.subscribeMsg_sc = subscribeMsg_sc;
    globalConstantsFields.subscribeMsg_en = subscribeMsg_en;

    globalConstantsFields.contactus_tc = contactus_tc;
    globalConstantsFields.contactus_sc = contactus_sc;
    globalConstantsFields.contactus_en = contactus_en;

    globalConstantsFields.pastEvents_tc = pastEvents_tc;
    globalConstantsFields.pastEvents_sc = pastEvents_sc;
    globalConstantsFields.pastEvents_en = pastEvents_en;

    globalConstantsFields.termsAndConditions_tc = termsAndConditions_tc;
    globalConstantsFields.termsAndConditions_sc = termsAndConditions_sc;
    globalConstantsFields.termsAndConditions_en = termsAndConditions_en;

    globalConstantsFields.copyright_tc = copyright_tc;
    globalConstantsFields.copyright_sc = copyright_sc;
    globalConstantsFields.copyright_en = copyright_en;

    globalConstantsFields.artistInfo_tc = artistInfo_tc;
    globalConstantsFields.artistInfo_sc = artistInfo_sc;
    globalConstantsFields.artistInfo_en = artistInfo_en;

    // globalConstantsFields.communityPerformanceIndicator_tc = communityPerformanceIndicator_tc;
    // globalConstantsFields.communityPerformanceIndicator_sc = communityPerformanceIndicator_sc;
    // globalConstantsFields.communityPerformanceIndicator_en = communityPerformanceIndicator_en;

    globalConstantsFields.otherShow_tc = otherShow_tc;
    globalConstantsFields.otherShow_sc = otherShow_sc;
    globalConstantsFields.otherShow_en = otherShow_en;

    globalConstantsFields.sound_tc = sound_tc;
    globalConstantsFields.sound_sc = sound_sc;
    globalConstantsFields.sound_en = sound_en;

    globalConstantsFields.searching_tc = searching_tc;
    globalConstantsFields.searching_sc = searching_sc;
    globalConstantsFields.searching_en = searching_en;

    globalConstantsFields.notfound_tc = notfound_tc;
    globalConstantsFields.notfound_sc = notfound_sc;
    globalConstantsFields.notfound_en = notfound_en;

    globalConstantsFields.found1_tc = found1_tc;
    globalConstantsFields.found1_sc = found1_sc;
    globalConstantsFields.found1_en = found1_en;

    globalConstantsFields.found2_tc = found2_tc;
    globalConstantsFields.found2_sc = found2_sc;
    globalConstantsFields.found2_en = found2_en;

    globalConstantsFields.galleryOfShow_tc = galleryOfShow_tc;
    globalConstantsFields.galleryOfShow_sc = galleryOfShow_sc;
    globalConstantsFields.galleryOfShow_en = galleryOfShow_en;

    globalConstantsFields.exhibitionImages_tc = exhibitionImages_tc;
    globalConstantsFields.exhibitionImages_sc = exhibitionImages_sc;
    globalConstantsFields.exhibitionImages_en = exhibitionImages_en;

    globalConstantsFields.page404Message_tc = page404Message_tc;
    globalConstantsFields.page404Message_sc = page404Message_sc;
    globalConstantsFields.page404Message_en = page404Message_en;

    globalConstantsFields.media_tc = media_tc;
    globalConstantsFields.media_sc = media_sc;
    globalConstantsFields.media_en = media_en;

    globalConstantsFields.privacypolicies_tc = privacypolicies_tc;
    globalConstantsFields.privacypolicies_sc = privacypolicies_sc;
    globalConstantsFields.privacypolicies_en = privacypolicies_en;

    globalConstantsFields.date_tc = date_tc;
    globalConstantsFields.date_sc = date_sc;
    globalConstantsFields.date_en = date_en;

    globalConstantsFields.scriptArrangement_tc = scriptArrangement_tc;
    globalConstantsFields.scriptArrangement_sc = scriptArrangement_sc;
    globalConstantsFields.scriptArrangement_en = scriptArrangement_en;

    globalConstantsFields.viewOurTeam_tc = viewOurTeam_tc;
    globalConstantsFields.viewOurTeam_sc = viewOurTeam_sc;
    globalConstantsFields.viewOurTeam_en = viewOurTeam_en;

    globalConstantsFields.photos_tc = photos_tc;
    globalConstantsFields.photos_sc = photos_sc;
    globalConstantsFields.photos_en = photos_en;

    globalConstantsFields.videos_tc = videos_tc;
    globalConstantsFields.videos_sc = videos_sc;
    globalConstantsFields.videos_en = videos_en;

    globalConstantsFields.lastModifyDT = new Date();
    globalConstantsFields.lastModifyUser = req.user._id;

    try {
      const oldGlobalConstants = await GlobalConstants.findOne({});
      let newGlobalConstants = null;

      if (oldGlobalConstants) {
        // update flow
        newGlobalConstants = await GlobalConstants.findOneAndUpdate(
          {},
          { $set: globalConstantsFields }
        );
      } else {
        // insert flow
        newGlobalConstants = new GlobalConstants(globalConstantsFields);

        await newGlobalConstants.save();
      }

      res.json(newGlobalConstants);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
