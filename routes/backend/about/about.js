const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { About, aboutResponseTypes } = require('../../../models/About');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const aboutSelect = {};

const aboutPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'planGallery',
    select: mediumSelect
  },
  {
    path: 'theaterImage',
    select: mediumSelect
  }
];

const aboutValidationChecks = [
  check('barwoDesc_tc', aboutResponseTypes.BARWO_DESC_TC_REQUIRED).notEmpty(),
  check('barwoDesc_sc', aboutResponseTypes.BARWO_DESC_SC_REQUIRED).notEmpty(),
  check('barwoDesc_en', aboutResponseTypes.BARWO_DESC_EN_REQUIRED).notEmpty(),
  check('planDesc_tc', aboutResponseTypes.PLAN_DESC_TC_REQUIRED).notEmpty(),
  check('planDesc_sc', aboutResponseTypes.PLAN_DESC_SC_REQUIRED).notEmpty(),
  check('planDesc_en', aboutResponseTypes.PLAN_DESC_EN_REQUIRED).notEmpty(),
  check(
    'theaterLocationName_tc',
    aboutResponseTypes.THEATER_LOCATION_TC_REQUIRED
  ).notEmpty(),
  check(
    'theaterLocationName_sc',
    aboutResponseTypes.THEATER_LOCATION_SC_REQUIRED
  ).notEmpty(),
  check(
    'theaterLocationName_en',
    aboutResponseTypes.THEATER_LOCATION_EN_REQUIRED
  ).notEmpty()
];

const aboutAdminsValidation = admins => {
  for (const admin of getArraySafe(admins)) {
    let errorType = null;

    if (!admin.title_tc) {
      errorType = aboutResponseTypes.ADMIN_TITLE_TC_REQUIRED;
    } else if (!admin.title_sc) {
      errorType = aboutResponseTypes.ADMIN_TITLE_SC_REQUIRED;
    } else if (!admin.title_en) {
      errorType = aboutResponseTypes.ADMIN_TITLE_EN_REQUIRED;
    } else if (!admin.name_tc) {
      errorType = aboutResponseTypes.ADMIN_NAME_TC_REQUIRED;
    } else if (!admin.name_sc) {
      errorType = aboutResponseTypes.ADMIN_NAME_SC_REQUIRED;
    } else if (!admin.name_en) {
      errorType = aboutResponseTypes.ADMIN_NAME_EN_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const aboutProductionPersonsValidation = productionPersons => {
  for (const productionPerson of getArraySafe(productionPersons)) {
    let errorType = null;

    if (!productionPerson.title_tc) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_TITLE_TC_REQUIRED;
    } else if (!productionPerson.title_sc) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_TITLE_SC_REQUIRED;
    } else if (!productionPerson.title_en) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_TITLE_EN_REQUIRED;
    } else if (!productionPerson.name_tc) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_NAME_TC_REQUIRED;
    } else if (!productionPerson.name_sc) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_NAME_SC_REQUIRED;
    } else if (!productionPerson.name_en) {
      errorType = aboutResponseTypes.PRODUCTION_PERSON_NAME_EN_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const handleAboutRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const aboutRelationshipsValidation = (admins, productionPersons, res) => {
  let errorType = null;

  errorType = aboutAdminsValidation(admins);
  if (errorType) {
    handleAboutRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = aboutProductionPersonsValidation(productionPersons);
  if (errorType) {
    handleAboutRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

/* end of utilities */

// @route   GET api/backend/about/about
// @desc    Get About
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const about = await About.findOne({})
      .select(aboutSelect)
      .populate(aboutPopulationList);
    if (!about) {
      return res.status(404).json({
        errors: [aboutResponseTypes.ABOUT_NOT_EXISTS]
      });
    }
    res.json(about);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/backend/about/about
// @desc    Add or update About
// @access  Private
router.post(
  '/',
  [auth, aboutValidationChecks, validationHandling],
  async (req, res) => {
    const {
      barwoDesc_tc,
      barwoDesc_sc,
      barwoDesc_en,
      planDesc_tc,
      planDesc_sc,
      planDesc_en,
      planGallery,
      theaterImage,
      theaterLocationName_tc,
      theaterLocationName_sc,
      theaterLocationName_en,
      theaterLocationHref_tc,
      theaterLocationHref_sc,
      theaterLocationHref_en,
      theaterLocationDesc1_tc,
      theaterLocationDesc1_sc,
      theaterLocationDesc1_en,
      theaterLocationDesc2_tc,
      theaterLocationDesc2_sc,
      theaterLocationDesc2_en,
      theaterTraffic_tc,
      theaterTraffic_sc,
      theaterTraffic_en,
      // contactWebsite,
      // contactTel,
      // contactFax,
      // contactEmail,
      admins,
      productionPersons
    } = req.body;

    // customed validations
    let isSuccess = aboutRelationshipsValidation(
      admins,
      productionPersons,
      res
    );
    if (!isSuccess) {
      return;
    }

    // Build about object
    // Note:
    // non-required fields do not need null check
    const aboutFields = {};
    if (barwoDesc_tc) aboutFields.barwoDesc_tc = barwoDesc_tc;
    if (barwoDesc_sc) aboutFields.barwoDesc_sc = barwoDesc_sc;
    if (barwoDesc_en) aboutFields.barwoDesc_en = barwoDesc_en;

    if (planDesc_tc) aboutFields.planDesc_tc = planDesc_tc;
    if (planDesc_sc) aboutFields.planDesc_sc = planDesc_sc;
    if (planDesc_en) aboutFields.planDesc_en = planDesc_en;
    aboutFields.planGallery = getArraySafe(planGallery);

    if (theaterLocationName_tc)
      aboutFields.theaterLocationName_tc = theaterLocationName_tc;
    if (theaterLocationName_sc)
      aboutFields.theaterLocationName_sc = theaterLocationName_sc;
    if (theaterLocationName_en)
      aboutFields.theaterLocationName_en = theaterLocationName_en;
    aboutFields.theaterLocationHref_tc = theaterLocationHref_tc;
    aboutFields.theaterLocationHref_sc = theaterLocationHref_sc;
    aboutFields.theaterLocationHref_en = theaterLocationHref_en;
    aboutFields.theaterLocationDesc1_tc = theaterLocationDesc1_tc;
    aboutFields.theaterLocationDesc1_sc = theaterLocationDesc1_sc;
    aboutFields.theaterLocationDesc1_en = theaterLocationDesc1_en;
    aboutFields.theaterLocationDesc2_tc = theaterLocationDesc2_tc;
    aboutFields.theaterLocationDesc2_sc = theaterLocationDesc2_sc;
    aboutFields.theaterLocationDesc2_en = theaterLocationDesc2_en;
    aboutFields.theaterTraffic_tc = theaterTraffic_tc;
    aboutFields.theaterTraffic_sc = theaterTraffic_sc;
    aboutFields.theaterTraffic_en = theaterTraffic_en;
    // aboutFields.contactWebsite = contactWebsite;
    // aboutFields.contactTel = contactTel;
    // aboutFields.contactFax = contactFax;
    // aboutFields.contactEmail = contactEmail;
    aboutFields.theaterImage = theaterImage;

    aboutFields.admins = getArraySafe(admins);
    aboutFields.productionPersons = getArraySafe(productionPersons);

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
