const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  GlobalConstants,
  globalConstantsResponseTypes
} = require('../../../models/GlobalConstants');

/* utilities */

const globalConstantsSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

/* end of utilities */

// @route   GET api/frontend/globalConstants/:lang/globalConstants
// @desc    Get landing page
// @access  Public
router.get('/:lang/globalConstants', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const globalConstants = await GlobalConstants.findOne({}).select(
      globalConstantsSelect
    );

    if (!globalConstants) {
      return res.status(404).json({
        errors: [globalConstantsResponseTypes.GLOBAL_CONSTANTS_NOT_EXISTS]
      });
    }

    // Note: different naming or capitalization of letters in fields of globalConstantsForFrontEnd and globalConstants is intentional here,
    // to cater for different namings in barwo-frontend
    const globalConstantsForFrontEnd = {
      latestShow: getEntityPropByLanguage(
        globalConstants,
        'latestShow',
        language
      ),
      latestShowIcon1: getEntityPropByLanguage(
        globalConstants,
        'latestShowIcon1',
        language
      ),
      latestShowIcon2: getEntityPropByLanguage(
        globalConstants,
        'latestShowIcon2',
        language
      ),
      scheduleOfShow: getEntityPropByLanguage(
        globalConstants,
        'scheduleOfShow',
        language
      ),
      teams: getEntityPropByLanguage(globalConstants, 'teams', language),
      artDirector: getEntityPropByLanguage(
        globalConstants,
        'artDirector',
        language
      ),
      actor: getEntityPropByLanguage(globalConstants, 'actor', language),
      artist: getEntityPropByLanguage(globalConstants, 'artist', language),
      detailsOfShow: getEntityPropByLanguage(
        globalConstants,
        'detailsOfShow',
        language
      ),
      show: getEntityPropByLanguage(globalConstants, 'show', language),
      allShow: getEntityPropByLanguage(globalConstants, 'allShow', language),
      activities: getEntityPropByLanguage(
        globalConstants,
        'activities',
        language
      ),
      downloadPDF: getEntityPropByLanguage(
        globalConstants,
        'downloadPDF',
        language
      ),
      ourActors: getEntityPropByLanguage(
        globalConstants,
        'ourActors',
        language
      ),
      ymtTheater: getEntityPropByLanguage(
        globalConstants,
        'ymtTheater',
        language
      ),
      followUs: getEntityPropByLanguage(globalConstants, 'followUs', language),
      all: getEntityPropByLanguage(globalConstants, 'all', language),
      boy: getEntityPropByLanguage(globalConstants, 'boy', language),
      girl: getEntityPropByLanguage(globalConstants, 'girl', language),
      inherit: getEntityPropByLanguage(globalConstants, 'inherit', language),
      share: getEntityPropByLanguage(globalConstants, 'share', language),
      relatedShow: getEntityPropByLanguage(
        globalConstants,
        'relatedShow',
        language
      ),
      relatedArtists: getEntityPropByLanguage(
        globalConstants,
        'relatedArtists',
        language
      ),
      relatedDrama: getEntityPropByLanguage(
        globalConstants,
        'relatedDrama',
        language
      ),
      allShows: getEntityPropByLanguage(globalConstants, 'allShows', language),
      more: getEntityPropByLanguage(globalConstants, 'more', language),
      scenarist: getEntityPropByLanguage(
        globalConstants,
        'scenarist',
        language
      ),
      introduction: getEntityPropByLanguage(
        globalConstants,
        'introduction',
        language
      ),
      // Note: different capitalizing of 'buyNow' here is intended
      buynow: getEntityPropByLanguage(globalConstants, 'buyNow', language),
      participating: getEntityPropByLanguage(
        globalConstants,
        'participating',
        language
      ),
      role: getEntityPropByLanguage(globalConstants, 'role', language),
      studentShow: getEntityPropByLanguage(
        globalConstants,
        'studentShow',
        language
      ),
      nextSchedule: getEntityPropByLanguage(
        globalConstants,
        'nextSchedule',
        language
      ),
      leaveContact: getEntityPropByLanguage(
        globalConstants,
        'leaveContact',
        language
      ),
      publicShow: getEntityPropByLanguage(
        globalConstants,
        'publicShow',
        language
      ),
      programOfShow: getEntityPropByLanguage(
        globalConstants,
        'programOfShow',
        language
      ),
      total1: getEntityPropByLanguage(globalConstants, 'total1', language),
      total2: getEntityPropByLanguage(globalConstants, 'total2', language),
      about: getEntityPropByLanguage(globalConstants, 'about', language),
      map: getEntityPropByLanguage(globalConstants, 'map', language),
      traffic: getEntityPropByLanguage(globalConstants, 'traffic', language),
      contact: getEntityPropByLanguage(globalConstants, 'contact', language),
      website: getEntityPropByLanguage(globalConstants, 'website', language),
      contactInfo: getEntityPropByLanguage(
        globalConstants,
        'contactInfo',
        language
      ),
      tel: getEntityPropByLanguage(globalConstants, 'tel', language),
      fax: getEntityPropByLanguage(globalConstants, 'fax', language),
      email: getEntityPropByLanguage(globalConstants, 'email', language),
      RESEARCH_AND_EDUCATION: getEntityPropByLanguage(
        globalConstants,
        'researchAndEducation',
        language
      ),
      GUIDED_TALK: getEntityPropByLanguage(
        globalConstants,
        'guidedTalk',
        language
      ),
      YOUTH_PROGRAMME: getEntityPropByLanguage(
        globalConstants,
        'youthProgramme',
        language
      ),
      CANTONESE_OPERA_KNOWLEDGE: getEntityPropByLanguage(
        globalConstants,
        'cantoneseOperaKnowledge',
        language
      ),
      COLLEGE_SHOW: getEntityPropByLanguage(
        globalConstants,
        'collegeShow',
        language
      ),
      EXHIBITION: getEntityPropByLanguage(
        globalConstants,
        'exhibition',
        language
      ),
      details: getEntityPropByLanguage(globalConstants, 'details', language),
      dateOfShow: getEntityPropByLanguage(
        globalConstants,
        'dateOfShow',
        language
      ),
      location: getEntityPropByLanguage(globalConstants, 'location', language),
      news: getEntityPropByLanguage(globalConstants, 'news', language),
      relatedNews: getEntityPropByLanguage(
        globalConstants,
        'relatedNews',
        language
      ),

      ticketInfo: getEntityPropByLanguage(
        globalConstants,
        'ticketInfo',
        language
      ),
      venue: getEntityPropByLanguage(globalConstants, 'venue', language),
      ticketPrice: getEntityPropByLanguage(
        globalConstants,
        'ticketPrice',
        language
      ),
      ticketWebsite: getEntityPropByLanguage(
        globalConstants,
        'ticketWebsite',
        language
      ),
      barwo: getEntityPropByLanguage(globalConstants, 'barwo', language),
      plan: getEntityPropByLanguage(globalConstants, 'plan', language),
      admins: getEntityPropByLanguage(globalConstants, 'admins', language),
      productionPersons: getEntityPropByLanguage(
        globalConstants,
        'productionPersons',
        language
      ),
      organizer: getEntityPropByLanguage(
        globalConstants,
        'organizer',
        language
      ),
      sponsor: getEntityPropByLanguage(globalConstants, 'sponsor', language),
      search: getEntityPropByLanguage(globalConstants, 'search', language),
      activity: getEntityPropByLanguage(globalConstants, 'activity', language),
      event: getEntityPropByLanguage(globalConstants, 'event', language),
      SPECIAL_NOTICE: getEntityPropByLanguage(
        globalConstants,
        'SPECIAL_NOTICE',
        language
      ),
      PRESS_RELEASE: getEntityPropByLanguage(
        globalConstants,
        'PRESS_RELEASE',
        language
      ),
      INTERVIEW: getEntityPropByLanguage(
        globalConstants,
        'INTERVIEW',
        language
      ),
      newsmedia: getEntityPropByLanguage(
        globalConstants,
        'newsmedia',
        language
      ),
      newsletter: getEntityPropByLanguage(
        globalConstants,
        'newsletter',
        language
      ),
      EMAIL_SUCCESS: getEntityPropByLanguage(
        globalConstants,
        'EMAIL_SUCCESS',
        language
      ),
      EMAIL_ADDRESS_INVALID: getEntityPropByLanguage(
        globalConstants,
        'EMAIL_ADDRESS_INVALID',
        language
      ),
      EMAIL_ADDRESS_ALREADY_EXISTS: getEntityPropByLanguage(
        globalConstants,
        'EMAIL_ADDRESS_ALREADY_EXISTS',
        language
      ),
      subscribeMsg: getEntityPropByLanguage(
        globalConstants,
        'subscribeMsg',
        language
      ),
      contactus: getEntityPropByLanguage(
        globalConstants,
        'contactus',
        language
      ),
      passEvent: getEntityPropByLanguage(
        globalConstants,
        'pastEvents',
        language
      ),
      tandc: getEntityPropByLanguage(
        globalConstants,
        'termsAndConditions',
        language
      ),
      copyright: getEntityPropByLanguage(
        globalConstants,
        'copyright',
        language
      ),
      artistInfo: getEntityPropByLanguage(
        globalConstants,
        'artistInfo',
        language
      ),
      communityPerformanceIndicator: getEntityPropByLanguage(
        globalConstants,
        'communityPerformanceIndicator',
        language
      ),
      otherShow: getEntityPropByLanguage(
        globalConstants,
        'otherShow',
        language
      ),
      sound: getEntityPropByLanguage(globalConstants, 'sound', language),
      searching: getEntityPropByLanguage(
        globalConstants,
        'searching',
        language
      ),
      notfound: getEntityPropByLanguage(globalConstants, 'notfound', language),
      found1: getEntityPropByLanguage(globalConstants, 'found1', language),
      found2: getEntityPropByLanguage(globalConstants, 'found2', language),
      galleryOfShow: getEntityPropByLanguage(
        globalConstants,
        'galleryOfShow',
        language
      ),
      exhibitionImages: getEntityPropByLanguage(
        globalConstants,
        'exhibitionImages',
        language
      ),
      _404: getEntityPropByLanguage(
        globalConstants,
        'page404Message',
        language
      ),
      media: getEntityPropByLanguage(globalConstants, 'media', language),
      privacypolicies: getEntityPropByLanguage(
        globalConstants,
        'privacypolicies',
        language
      )
    };
    res.json(globalConstantsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
