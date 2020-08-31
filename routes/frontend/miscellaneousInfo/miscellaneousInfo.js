const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  MiscellaneousInfo,
  miscellaneousInfoResponseTypes
} = require('../../../models/MiscellaneousInfo');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const miscellaneousInfoSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const miscellaneousInfoPopulationList = [
  {
    path: 'footerOrganizerLogos',
    select: mediumSelect
  },
  {
    path: 'footerSponsorLogos',
    select: mediumSelect
  }
];

/* end of utilities */

// @route   GET api/frontend/miscellaneousInfo/:lang/miscellaneousInfo
// @desc    Get Miscellaneous Info
// @access  Public
router.get('/:lang/miscellaneousInfo', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const miscellaneousInfo = await MiscellaneousInfo.findOne({})
      .select(miscellaneousInfoSelect)
      .populate(miscellaneousInfoPopulationList);

    if (!miscellaneousInfo) {
      return res.status(404).json({
        errors: [miscellaneousInfoResponseTypes.MISCELLANEOUS_INFO_NOT_EXISTS]
      });
    }

    const miscellaneousInfoForFrontEnd = {
      termsAndConditions: {
        title: getEntityPropByLanguage(
          miscellaneousInfo,
          'termsAndConditionsTitle',
          language
        ),
        description: getEntityPropByLanguage(
          miscellaneousInfo,
          'termsAndConditionsDesc',
          language
        )
      },
      privacyPolicy: {
        title: getEntityPropByLanguage(
          miscellaneousInfo,
          'privacyPolicyTitle',
          language
        ),
        description: getEntityPropByLanguage(
          miscellaneousInfo,
          'privacyPolicyDesc',
          language
        )
      },
      contact: {
        address: getEntityPropByLanguage(
          miscellaneousInfo,
          'contactAddress',
          language
        ),
        tel: miscellaneousInfo.contactTel,
        fax: miscellaneousInfo.contactFax,
        email: miscellaneousInfo.contactEmail
      },
      footer: {
        organizerLogos: getArraySafe(
          miscellaneousInfo.footerOrganizerLogos
        ).map(logo => ({
          src: logo && logo.url
        })),
        sponsorLogos: getArraySafe(miscellaneousInfo.footerSponsorLogos).map(
          logo => ({
            src: logo && logo.url
          })
        ),
        facebookLink: miscellaneousInfo.facebookLink,
        youtubeLink: miscellaneousInfo.youtubeLink,
        instagramLink: miscellaneousInfo.instagramLink,
        wechatLink: miscellaneousInfo.wechatLink
      }
    };

    res.json(miscellaneousInfoForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
