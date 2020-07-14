const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { About, aboutResponseTypes } = require('../../../models/About');

/* utilities */

const aboutSelect = {};

const aboutPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'gallery',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  }
];

const aboutValidationChecks = [
  check('barwo_tc', aboutResponseTypes.BARWO_TC_REQUIRED).notEmpty(),
  check('barwo_sc', aboutResponseTypes.BARWO_SC_REQUIRED).notEmpty(),
  check('barwo_en', aboutResponseTypes.BARWO_EN_REQUIRED).notEmpty(),
  check('plan_tc', aboutResponseTypes.PLAN_TC_REQUIRED).notEmpty(),
  check('plan_sc', aboutResponseTypes.PLAN_SC_REQUIRED).notEmpty(),
  check('plan_en', aboutResponseTypes.PLAN_EN_REQUIRED).notEmpty(),
  check(
    'theaterLocation_tc',
    aboutResponseTypes.THEATER_LOCATION_TC_REQUIRED
  ).notEmpty(),
  check(
    'theaterLocation_sc',
    aboutResponseTypes.THEATER_LOCATION_SC_REQUIRED
  ).notEmpty(),
  check(
    'theaterLocation_en',
    aboutResponseTypes.THEATER_LOCATION_EN_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc1_tc',
    aboutResponseTypes.THEATER_TRAFFIC_TC_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc1_sc',
    aboutResponseTypes.THEATER_TRAFFIC_SC_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc1_en',
    aboutResponseTypes.THEATER_TRAFFIC_EN_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc2_tc',
    aboutResponseTypes.THEATER_DESC1_TC_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc2_sc',
    aboutResponseTypes.THEATER_DESC1_SC_REQUIRED
  ).notEmpty(),
  check(
    'theaterDesc2_en',
    aboutResponseTypes.THEATER_DESC1_EN_REQUIRED
  ).notEmpty(),
  check(
    'theaterTraffic_tc',
    aboutResponseTypes.THEATER_DESC2_TC_REQUIRED
  ).notEmpty(),
  check(
    'theaterTraffic_sc',
    aboutResponseTypes.THEATER_DESC2_SC_REQUIRED
  ).notEmpty(),
  check(
    'theaterTraffic_en',
    aboutResponseTypes.THEATER_DESC2_EN_REQUIRED
  ).notEmpty(),
  check(
    'contactWebsite',
    aboutResponseTypes.CONTACT_WEBSITE_REQUIRED
  ).notEmpty(),
  check('contactTel', aboutResponseTypes.CONTACT_TEL_REQUIRED).notEmpty(),
  check('contactFax', aboutResponseTypes.CONTACT_FAX_REQUIRED).notEmpty(),
  check('contactEmail', aboutResponseTypes.CONTACT_EMAIL_REQUIRED).notEmpty(),
  check('adminTitle_tc', aboutResponseTypes.ADMIN_TITLE_TC_REQUIRED).notEmpty(),
  check('adminTitle_sc', aboutResponseTypes.ADMIN_TITLE_SC_REQUIRED).notEmpty(),
  check('adminTitle_en', aboutResponseTypes.ADMIN_TITLE_EN_REQUIRED).notEmpty(),
  check('adminName_tc', aboutResponseTypes.ADMIN_NAME_SC_REQUIRED).notEmpty(),
  check('adminName_sc', aboutResponseTypes.ADMIN_NAME_EN_REQUIRED).notEmpty(),
  check('adminName_en', aboutResponseTypes.ADMIN_NAME_EN_REQUIRED).notEmpty()
];

/* end of utilities */

// @route   GET api/backend/about/about
// @desc    Get Global Constants
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const about = await About.findOne({})
      .select(aboutSelect)
      .populate(aboutPopulationList);
    if (!about) {
      return res.status(404).json({
        errors: [aboutResponseTypes.ABOUT_PAGE_NOT_EXISTS]
      });
    }
    res.json(about);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [aboutResponseTypes.ABOUT_PAGE_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/about/about
// @desc    Add or update Global Constants
// @access  Private
router.post(
  '/',
  [auth, aboutValidationChecks, validationHandling],
  async (req, res) => {
    const {
      barwo_tc,
      barwo_sc,
      barwo_en,
      plan_tc,
      plan_sc,
      plan_en,
      plan_gallery,
      theaterLocation_tc,
      theaterLocation_sc,
      theaterLocation_en,
      theaterDesc1_tc,
      theaterDesc1_sc,
      theaterDesc1_en,
      theaterDesc2_tc,
      theaterDesc2_sc,
      theaterDesc2_en,
      theaterTraffic_tc,
      theaterTraffic_sc,
      theaterTraffic_en,
      contactWebsite,
      contactTel,
      contactFax,
      contactEmail,
      theaterImage,
      adminTitle_tc,
      adminTitle_sc,
      adminTitle_en,
      adminName_tc,
      adminName_sc,
      adminName_en
    } = req.body;

    // Build global constants object
    // Note:
    // non-required fields do not need null check
    const aboutFields = {};
    aboutFields.barwo_tc = barwo_tc;
    aboutFields.barwo_sc = barwo_sc;
    aboutFields.barwo_en = barwo_en;

    aboutFields.plan_tc = plan_tc;
    aboutFields.plan_sc = plan_sc;
    aboutFields.plan_en = plan_en;
    aboutFields.plan_gallery = plan_gallery;

    aboutFields.theaterLocation_tc = theaterLocation_tc;
    aboutFields.theaterLocation_sc = theaterLocation_sc;
    aboutFields.theaterLocation_en = theaterLocation_en;
    aboutFields.theaterDesc1_tc = theaterDesc1_tc;
    aboutFields.theaterDesc1_sc = theaterDesc1_sc;
    aboutFields.theaterDesc1_en = theaterDesc1_en;
    aboutFields.theaterDesc2_tc = theaterDesc2_tc;
    aboutFields.theaterDesc2_sc = theaterDesc2_sc;
    aboutFields.theaterDesc2_en = theaterDesc2_en;
    aboutFields.theaterTraffic_tc = theaterTraffic_tc;
    aboutFields.theaterTraffic_sc = theaterTraffic_sc;
    aboutFields.theaterTraffic_en = theaterTraffic_en;
    aboutFields.contactWebsite = contactWebsite;
    aboutFields.contactTel = contactTel;
    aboutFields.contactFax = contactFax;
    aboutFields.contactEmail = contactEmail;
    aboutFields.theaterImage = theaterImage;

    aboutFields.adminTitle_tc = adminTitle_tc;
    aboutFields.adminTitle_sc = adminTitle_sc;
    aboutFields.adminTitle_en = adminTitle_en;
    aboutFields.adminName_tc = adminName_tc;
    aboutFields.adminName_sc = adminName_sc;
    aboutFields.adminName_en = adminName_en;

    aboutFields.lastModifyDT = new Date();
    aboutFields.lastModifyUser = req.user._id;

    try {
      const oldAbout = await About.findOne({});
      let newAbout = null;

      if (oldAbout) {
        // update flow
        newAbout = await About.findOneAndUpdate({}, { $set: aboutFields });
      } else {
        // insert flow
        newAbout = new About(aboutFields);

        await newAbout.save();
      }

      res.json(newAbout);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
