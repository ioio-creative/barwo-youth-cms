const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listingHandling = require('../../../middleware/listingHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const translateAllFieldsFromTcToSc = require('../../../utils/translate/translateAllFieldsFromTcToSc');
const {
  Phase,
  phaseResponseTypes,
  getPhaseDerivedLabel
} = require('../../../models/Phase');
const { Event } = require('../../../models/Event');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const phaseSelectForFindAll = {};

const phaseSelectForFindOne = { ...phaseSelectForFindAll };

const phaseDeleteSelectForFindOne = {
  events: 1
};

const phasePopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'events',
    select: 'label'
  },
  {
    path: 'downloadMedium',
    select: mediumSelect
  }
];

const phasePopulationListForFindOne = [...phasePopulationListForFindAll];

const phaseValidationChecks = [
  check('year', phaseResponseTypes.YEAR_REQUIRED).notEmpty(),
  check('phaseNumber', phaseResponseTypes.PHASE_NUMBER_REQUIRED).notEmpty(),
  check('fromDate', phaseResponseTypes.FROM_DATE_REQUIRED).notEmpty()
];

const setPhasesInvolvedForEvents = async (phaseId, events, session) => {
  const options = { session };

  // set event's phasesInvolved
  for (const event of getArraySafe(events)) {
    // event is event's _id
    await Event.findByIdAndUpdate(
      event,
      {
        $addToSet: {
          phasesInvolved: phaseId
        }
      },
      options
    );
  }
};

const removePhasesInvolvedForEvents = async (phase, session) => {
  const options = { session };

  for (const event of getArraySafe(phase.events)) {
    await Event.findByIdAndUpdate(
      event,
      {
        $pull: {
          phasesInvolved: phase._id
        }
      },
      options
    );
  }
};

const handlePhaseDerivedLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'derivedLabel',
    phaseResponseTypes.PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/phases/phases
// @desc    Get all phases
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: phaseSelectForFindAll,
      populate: phasePopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      findOptions = {
        ...findOptions,
        $or: [{ derivedLabel: filterTextRegex }]
      };
    }

    const phases = await Phase.paginate(findOptions, options);
    res.json(phases);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/phases/phases/:_id
// @desc    Get phase by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const phase = await Phase.findById(req.params._id)
      .select(phaseSelectForFindOne)
      .populate(phasePopulationListForFindOne);
    if (!phase) {
      return res
        .status(404)
        .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });
    }
    res.json(phase);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });
  }
});

// @route   POST api/backend/phase/phases
// @desc    Add phase
// @access  Private
router.post(
  '/',
  [auth, phaseValidationChecks, validationHandling],
  async (req, res) => {
    const {
      year,
      phaseNumber,
      events,
      themeColor,
      fromDate,
      toDate,
      downloadName_tc,
      downloadName_sc,
      downloadName_en,
      downloadMedium,
      ticketSaleRemarks_tc,
      ticketSaleRemarks_sc,
      ticketSaleRemarks_en,
      isEnabled
    } = await translateAllFieldsFromTcToSc(req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const phase = new Phase({
        year,
        phaseNumber,
        derivedLabel: getPhaseDerivedLabel(year, phaseNumber),
        events,
        themeColor,
        fromDate,
        toDate,
        downloadName_tc,
        downloadName_sc,
        downloadName_en,
        downloadMedium,
        ticketSaleRemarks_tc,
        ticketSaleRemarks_sc,
        ticketSaleRemarks_en,
        isEnabled,
        lastModifyUser: req.user._id
      });

      await phase.save({ session });

      await setPhasesInvolvedForEvents(phase._id, events, session);

      await session.commitTransaction();

      res.json(phase);
    } catch (err) {
      await session.abortTransaction();
      if (!handlePhaseDerivedLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   PUT api/backend/phases/phases/:_id
// @desc    Update phase
// @access  Private
router.put(
  '/:_id',
  [auth, phaseValidationChecks, validationHandling],
  async (req, res) => {
    const {
      year,
      phaseNumber,
      events,
      themeColor,
      fromDate,
      toDate,
      downloadName_tc,
      downloadName_sc,
      downloadName_en,
      downloadMedium,
      ticketSaleRemarks_tc,
      ticketSaleRemarks_sc,
      ticketSaleRemarks_en,
      isEnabled
    } = req.body;

    // Build phase object
    // Note:
    // non-required fields do not need null check
    const phaseFields = {};
    if (year) phaseFields.year = year;
    if (phaseNumber > 0) phaseFields.phaseNumber = phaseNumber;
    if (year && phaseNumber > 0) {
      phaseFields.derivedLabel = getPhaseDerivedLabel(year, phaseNumber);
    }
    phaseFields.events = getArraySafe(events);
    phaseFields.themeColor = themeColor;
    if (fromDate) phaseFields.fromDate = fromDate;
    phaseFields.toDate = toDate;
    phaseFields.downloadName_tc = downloadName_tc;
    phaseFields.downloadName_sc = downloadName_sc;
    phaseFields.downloadName_en = downloadName_en;
    phaseFields.downloadMedium = downloadMedium;
    phaseFields.ticketSaleRemarks_tc = ticketSaleRemarks_tc;
    phaseFields.ticketSaleRemarks_sc = ticketSaleRemarks_sc;
    phaseFields.ticketSaleRemarks_en = ticketSaleRemarks_en;
    if (isEnabled !== undefined) phaseFields.isEnabled = isEnabled;
    phaseFields.lastModifyDT = new Date();
    phaseFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const phaseId = req.params._id;

    try {
      const oldPhase = await Phase.findById(phaseId).session(session);

      if (!oldPhase)
        return res
          .status(404)
          .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });

      await removePhasesInvolvedForEvents(oldPhase, session);

      const newPhase = await Phase.findByIdAndUpdate(
        phaseId,
        { $set: phaseFields },
        { session, new: true }
      );

      await setPhasesInvolvedForEvents(phaseId, newPhase.events, session);

      await session.commitTransaction();

      res.json(newPhase);
    } catch (err) {
      await session.abortTransaction();
      if (!handlePhaseDerivedLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   DELETE api/backend/phases/phases/:_id
// @desc    Delete phase
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const phase = await Phase.findById(req.params._id)
      .select(phaseDeleteSelectForFindOne)
      .session(session);

    if (!phase) {
      await session.commitTransaction();
      return res
        .status(404)
        .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });
    }

    await removePhasesInvolvedForEvents(phase, session);
    await Phase.findByIdAndDelete(req.params._id, { session });
    await session.commitTransaction();

    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    generalErrorHandle(err, res);
  } finally {
    session.endSession();
  }
});

module.exports = router;
