const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  GlobalConstants,
  globalConstantsResponseTypes
} = require('../../../models/GlobalConstants');

/* utilities */

const globalConstantsSelectAll = {};

const globalConstantsPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

/* end of utilities */

// @route   GET api/backend/globalConstants/globalConstants
// @desc    Get Global Constants
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const globalConstants = await GlobalConstants.findOne({})
      .select(globalConstantsSelectAll)
      .populate(globalConstantsPopulationList);
    if (!globalConstants) {
      return res.status(404).json({
        errors: [globalConstantsResponseTypes.GLOBAL_CONSTANTS_PAGE_NOT_EXISTS]
      });
    }
    res.json(globalConstants);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [globalConstantsResponseTypes.GLOBAL_CONSTANTS_PAGE_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/globalConstants/globalConstants
// @desc    Add or update Global Constants
// @access  Private
router.post('/', [auth], async (req, res) => {
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
    inherit_en
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

  try {
    const oldGlobal = await GlobalConstants.findOne({});
    const newGlobal = null;

    if (oldGlobal) {
      // update flow
      newGlobal = await GlobalConstants.findOneAndUpdate(
        {},
        { $set: globalConstantsFields }
      );
    } else {
      // insert flow
      newGlobal = new GlobalConstants(globalConstantsFields);

      await newGlobal.save();
    }

    res.json(newGlobal);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
