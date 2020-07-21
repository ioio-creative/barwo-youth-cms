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
    'RESEARCH_AND_EDUCATION_tc',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_TC_REQUIRED
  ).notEmpty(),
  check(
    'RESEARCH_AND_EDUCATION_sc',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_SC_REQUIRED
  ).notEmpty(),
  check(
    'RESEARCH_AND_EDUCATION_en',
    globalConstantsResponseTypes.RESEARCH_AND_EDUCATION_EN_REQUIRED
  ).notEmpty(),

  check(
    'knowledge_tc',
    globalConstantsResponseTypes.KNOWLEDGE_TC_REQUIRED
  ).notEmpty(),
  check(
    'knowledge_sc',
    globalConstantsResponseTypes.KNOWLEDGE_SC_REQUIRED
  ).notEmpty(),
  check(
    'knowledge_en',
    globalConstantsResponseTypes.KNOWLEDGE_EN_REQUIRED
  ).notEmpty(),

  check(
    'workshop_tc',
    globalConstantsResponseTypes.WORKSHOP_TC_REQUIRED
  ).notEmpty(),
  check(
    'workshop_sc',
    globalConstantsResponseTypes.WORKSHOP_SC_REQUIRED
  ).notEmpty(),
  check(
    'workshop_en',
    globalConstantsResponseTypes.WORKSHOP_EN_REQUIRED
  ).notEmpty(),

  check(
    'video_show_tc',
    globalConstantsResponseTypes.VIDEO_SHOW_TC_REQUIRED
  ).notEmpty(),
  check(
    'video_show_sc',
    globalConstantsResponseTypes.VIDEO_SHOW_SC_REQUIRED
  ).notEmpty(),
  check(
    'video_show_en',
    globalConstantsResponseTypes.VIDEO_SHOW_EN_REQUIRED
  ).notEmpty(),

  check(
    'sharing_tc',
    globalConstantsResponseTypes.SHARING_TC_REQUIRED
  ).notEmpty(),
  check(
    'sharing_sc',
    globalConstantsResponseTypes.SHARING_SC_REQUIRED
  ).notEmpty(),
  check(
    'sharing_en',
    globalConstantsResponseTypes.SHARING_EN_REQUIRED
  ).notEmpty(),

  check(
    'past_activity_tc',
    globalConstantsResponseTypes.PAST_ACTIVITY_TC_REQUIRED
  ).notEmpty(),
  check(
    'past_activity_sc',
    globalConstantsResponseTypes.PAST_ACTIVITY_SC_REQUIRED
  ).notEmpty(),
  check(
    'past_activity_en',
    globalConstantsResponseTypes.PAST_ACTIVITY_EN_REQUIRED
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
  ).notEmpty()
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
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [globalConstantsResponseTypes.GLOBAL_CONSTANTS_NOT_EXISTS]
    });
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

      scheduleOfShow_tc,
      scheduleOfShow_sc,
      scheduleOfShow_en,

      artDirector_tc,
      artDirector_sc,
      artDirector_en,

      actor_tc,
      actor_sc,
      actor_en,

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

      tel_tc,
      tel_sc,
      tel_en,

      fax_tc,
      fax_sc,
      fax_en,

      email_tc,
      email_sc,
      email_en,

      RESEARCH_AND_EDUCATION_tc,
      RESEARCH_AND_EDUCATION_sc,
      RESEARCH_AND_EDUCATION_en,

      knowledge_tc,
      knowledge_sc,
      knowledge_en,

      workshop_tc,
      workshop_sc,
      workshop_en,

      video_show_tc,
      video_show_sc,
      video_show_en,

      sharing_tc,
      sharing_sc,
      sharing_en,

      past_activity_tc,
      past_activity_sc,
      past_activity_en,

      details_tc,
      details_sc,
      details_en,

      dateOfShow_tc,
      dateOfShow_sc,
      dateOfShow_en,

      location_tc,
      location_sc,
      location_en,

      relatedNews_tc,
      relatedNews_sc,
      relatedNews_en
    } = req.body;

    // Build global constants object
    // Note:
    // non-required fields do not need null check
    const globalConstantsFields = {};
    globalConstantsFields.latestShow_tc = latestShow_tc;
    globalConstantsFields.latestShow_sc = latestShow_sc;
    globalConstantsFields.latestShow_en = latestShow_en;

    globalConstantsFields.scheduleOfShow_tc = scheduleOfShow_tc;
    globalConstantsFields.scheduleOfShow_sc = scheduleOfShow_sc;
    globalConstantsFields.scheduleOfShow_en = scheduleOfShow_en;

    globalConstantsFields.artDirector_tc = artDirector_tc;
    globalConstantsFields.artDirector_sc = artDirector_sc;
    globalConstantsFields.artDirector_en = artDirector_en;

    globalConstantsFields.actor_tc = actor_tc;
    globalConstantsFields.actor_sc = actor_sc;
    globalConstantsFields.actor_en = actor_en;

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

    globalConstantsFields.tel_tc = tel_tc;
    globalConstantsFields.tel_sc = tel_sc;
    globalConstantsFields.tel_en = tel_en;

    globalConstantsFields.fax_tc = fax_tc;
    globalConstantsFields.fax_sc = fax_sc;
    globalConstantsFields.fax_en = fax_en;

    globalConstantsFields.email_tc = email_tc;
    globalConstantsFields.email_sc = email_sc;
    globalConstantsFields.email_en = email_en;

    globalConstantsFields.RESEARCH_AND_EDUCATION_tc = RESEARCH_AND_EDUCATION_tc;
    globalConstantsFields.RESEARCH_AND_EDUCATION_sc = RESEARCH_AND_EDUCATION_sc;
    globalConstantsFields.RESEARCH_AND_EDUCATION_en = RESEARCH_AND_EDUCATION_en;

    globalConstantsFields.knowledge_tc = knowledge_tc;
    globalConstantsFields.knowledge_sc = knowledge_sc;
    globalConstantsFields.knowledge_en = knowledge_en;

    globalConstantsFields.workshop_tc = workshop_tc;
    globalConstantsFields.workshop_sc = workshop_sc;
    globalConstantsFields.workshop_en = workshop_en;

    globalConstantsFields.video_show_tc = video_show_tc;
    globalConstantsFields.video_show_sc = video_show_sc;
    globalConstantsFields.video_show_en = video_show_en;

    globalConstantsFields.sharing_tc = sharing_tc;
    globalConstantsFields.sharing_sc = sharing_sc;
    globalConstantsFields.sharing_en = sharing_en;

    globalConstantsFields.past_activity_tc = past_activity_tc;
    globalConstantsFields.past_activity_sc = past_activity_sc;
    globalConstantsFields.past_activity_en = past_activity_en;

    globalConstantsFields.details_tc = details_tc;
    globalConstantsFields.details_sc = details_sc;
    globalConstantsFields.details_en = details_en;

    globalConstantsFields.dateOfShow_tc = dateOfShow_tc;
    globalConstantsFields.dateOfShow_sc = dateOfShow_sc;
    globalConstantsFields.dateOfShow_en = dateOfShow_en;

    globalConstantsFields.location_tc = location_tc;
    globalConstantsFields.location_sc = location_sc;
    globalConstantsFields.location_en = location_en;

    globalConstantsFields.relatedNews_tc = relatedNews_tc;
    globalConstantsFields.relatedNews_sc = relatedNews_sc;
    globalConstantsFields.relatedNews_en = relatedNews_en;

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
