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

    const globalConstantsForFrontEnd = {
      latestShow: getEntityPropByLanguage(
        globalConstants,
        'latestShow',
        language
      ),
      scheduleOfShow: getEntityPropByLanguage(
        globalConstants,
        'scheduleOfShow',
        language
      ),
      artDirector: getEntityPropByLanguage(
        globalConstants,
        'artDirector',
        language
      ),
      actor: getEntityPropByLanguage(globalConstants, 'actor', language),
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
      buynow: getEntityPropByLanguage(globalConstants, 'buynow', language),
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
      programOfshow: getEntityPropByLanguage(
        globalConstants,
        'programOfshow',
        language
      )
    };
    res.json(globalConstantsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;