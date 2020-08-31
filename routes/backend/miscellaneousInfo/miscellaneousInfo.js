const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  MiscellaneousInfo,
  miscellaneousInfoResponseTypes
} = require('../../../models/MiscellaneousInfo');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const miscellaneousInfoSelect = {};

const miscellaneousInfoPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'footerOrganizerLogos',
    select: mediumSelect
  },
  {
    path: 'footerSponsorLogos',
    select: mediumSelect
  }
];

const miscellaneousInfoValidationChecks = [
  check(
    'termsAndConditionsTitle_tc',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditionsTitle_sc',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditionsTitle_en',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED
  ).notEmpty(),

  check(
    'termsAndConditionsDesc_tc',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_DESC_TC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditionsDesc_sc',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_DESC_SC_REQUIRED
  ).notEmpty(),
  check(
    'termsAndConditionsDesc_en',
    miscellaneousInfoResponseTypes.TERMS_AND_CONDITIONS_DESC_EN_REQUIRED
  ).notEmpty(),

  check(
    'privacyPolicyTitle_tc',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_TITLE_TC_REQUIRED
  ).notEmpty(),
  check(
    'privacyPolicyTitle_sc',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_TITLE_SC_REQUIRED
  ).notEmpty(),
  check(
    'privacyPolicyTitle_en',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_TITLE_EN_REQUIRED
  ).notEmpty(),

  check(
    'privacyPolicyDesc_tc',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_DESC_TC_REQUIRED
  ).notEmpty(),
  check(
    'privacyPolicyDesc_sc',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_DESC_SC_REQUIRED
  ).notEmpty(),
  check(
    'privacyPolicyDesc_en',
    miscellaneousInfoResponseTypes.PRIVACY_POLICY_DESC_EN_REQUIRED
  ).notEmpty(),

  check(
    'contactAddress_tc',
    miscellaneousInfoResponseTypes.CONTACT_ADDRESS_TC_REQUIRED
  ).notEmpty(),
  check(
    'contactAddress_sc',
    miscellaneousInfoResponseTypes.CONTACT_ADDRESS_SC_REQUIRED
  ).notEmpty(),
  check(
    'contactAddress_en',
    miscellaneousInfoResponseTypes.CONTACT_ADDRESS_EN_REQUIRED
  ).notEmpty(),

  check(
    'contactTel',
    miscellaneousInfoResponseTypes.CONTACT_TEL_REQUIRED
  ).notEmpty(),
  check(
    'contactFax',
    miscellaneousInfoResponseTypes.CONTACT_FAX_REQUIRED
  ).notEmpty(),
  check(
    'contactEmail',
    miscellaneousInfoResponseTypes.CONTACT_EMAIL_REQUIRED
  ).notEmpty()
];

/* end of utilities */

// @route   GET api/backend/miscellaneousInfo/miscellaneousInfo
// @desc    Get Miscellaneous Info
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const miscellaneousInfo = await MiscellaneousInfo.findOne({})
      .select(miscellaneousInfoSelect)
      .populate(miscellaneousInfoPopulationList);
    if (!miscellaneousInfo) {
      return res.status(404).json({
        errors: [miscellaneousInfoResponseTypes.MISCELLANEOUS_INFO_NOT_EXISTS]
      });
    }
    res.json(miscellaneousInfo);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/backend/miscellaneousInfo/miscellaneousInfo
// @desc    Add or update Miscellaneous Info
// @access  Private
router.post(
  '/',
  [auth, miscellaneousInfoValidationChecks, validationHandling],
  async (req, res) => {
    const {
      termsAndConditionsTitle_tc,
      termsAndConditionsTitle_sc,
      termsAndConditionsTitle_en,

      termsAndConditionsDesc_tc,
      termsAndConditionsDesc_sc,
      termsAndConditionsDesc_en,

      privacyPolicyTitle_tc,
      privacyPolicyTitle_sc,
      privacyPolicyTitle_en,

      privacyPolicyDesc_tc,
      privacyPolicyDesc_sc,
      privacyPolicyDesc_en,

      contactAddress_tc,
      contactAddress_sc,
      contactAddress_en,

      contactTel,
      contactFax,
      contactEmail,

      footerOrganizerLogos,
      footerSponsorLogos,

      facebookLink,
      youtubeLink,
      instagramLink,
      wechatLink
    } = req.body;

    // Build miscellaneous info object
    // Note:
    // non-required fields do not need null check
    const miscellaneousFields = {};

    if (termsAndConditionsTitle_tc)
      miscellaneousFields.termsAndConditionsTitle_tc = termsAndConditionsTitle_tc;
    if (termsAndConditionsTitle_sc)
      miscellaneousFields.termsAndConditionsTitle_sc = termsAndConditionsTitle_sc;
    if (termsAndConditionsTitle_en)
      miscellaneousFields.termsAndConditionsTitle_en = termsAndConditionsTitle_en;

    if (termsAndConditionsDesc_tc)
      miscellaneousFields.termsAndConditionsDesc_tc = termsAndConditionsDesc_tc;
    if (termsAndConditionsDesc_sc)
      miscellaneousFields.termsAndConditionsDesc_sc = termsAndConditionsDesc_sc;
    if (termsAndConditionsDesc_en)
      miscellaneousFields.termsAndConditionsDesc_en = termsAndConditionsDesc_en;

    if (privacyPolicyTitle_tc)
      miscellaneousFields.privacyPolicyTitle_tc = privacyPolicyTitle_tc;
    if (privacyPolicyTitle_sc)
      miscellaneousFields.privacyPolicyTitle_sc = privacyPolicyTitle_sc;
    if (privacyPolicyTitle_en)
      miscellaneousFields.privacyPolicyTitle_en = privacyPolicyTitle_en;

    if (privacyPolicyDesc_tc)
      miscellaneousFields.privacyPolicyDesc_tc = privacyPolicyDesc_tc;
    if (privacyPolicyDesc_sc)
      miscellaneousFields.privacyPolicyDesc_sc = privacyPolicyDesc_sc;
    if (privacyPolicyDesc_en)
      miscellaneousFields.privacyPolicyDesc_en = privacyPolicyDesc_en;

    if (contactAddress_tc)
      miscellaneousFields.contactAddress_tc = contactAddress_tc;
    if (contactAddress_sc)
      miscellaneousFields.contactAddress_sc = contactAddress_sc;
    if (contactAddress_en)
      miscellaneousFields.contactAddress_en = contactAddress_en;

    if (contactTel) miscellaneousFields.contactTel = contactTel;
    if (contactFax) miscellaneousFields.contactFax = contactFax;
    if (contactEmail) miscellaneousFields.contactEmail = contactEmail;

    miscellaneousFields.footerOrganizerLogos = getArraySafe(
      footerOrganizerLogos
    );
    miscellaneousFields.footerSponsorLogos = getArraySafe(footerSponsorLogos);

    miscellaneousFields.facebookLink = facebookLink;
    miscellaneousFields.youtubeLink = youtubeLink;
    miscellaneousFields.instagramLink = instagramLink;
    miscellaneousFields.wechatLink = wechatLink;

    miscellaneousFields.lastModifyDT = new Date();
    miscellaneousFields.lastModifyUser = req.user._id;

    try {
      const oldMiscellaneousInfo = await MiscellaneousInfo.findOne({});
      let newMiscellaneousInfo = null;

      if (oldMiscellaneousInfo) {
        // update flow
        newMiscellaneousInfo = await MiscellaneousInfo.findOneAndUpdate(
          {},
          { $set: miscellaneousFields }
        );
      } else {
        // insert flow
        newMiscellaneousInfo = new MiscellaneousInfo(miscellaneousFields);

        await newMiscellaneousInfo.save();
      }

      res.json(newMiscellaneousInfo);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
