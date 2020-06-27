const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Phase, phaseResponseTypes } = require('../../../models/Phase');
const { Event } = require('../../../models/Event');

/* utilities */

const phaseSelect = {};

const phasePopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'events',
    select: 'label'
  }
];

const phasePopulationListForFindOne = [...phasePopulationListForFindAll];

const phaseValidationChecks = [
  check('year', phaseResponseTypes.YEAR_REQUIRED).not().isEmpty(),
  check('phaseNumber', phaseResponseTypes.PHASE_NUMBER_REQUIRED).not().isEmpty()
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

const getDerivedLabel = (year, phaseNumber) => {
  return (
    year.toString().padStart(4, '0') +
    '_' +
    phaseNumber.toString().padStart(2, '0')
  );
};

const handlePhaseDerivedLabelDuplicateKeyError = (error, res) => {
  console.log(JSON.stringify(error, null, 2));
  const { code, keyPattern } = error;
  const isDuplicateKeyError =
    code === 11000 &&
    keyPattern &&
    Object.keys(keyPattern).includes('derivedLabel');

  if (isDuplicateKeyError) {
    // bad request
    res.status(400).json({
      errors: [phaseResponseTypes.PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS]
    });
  }

  const isErrorHandled = isDuplicateKeyError;
  return isErrorHandled;
};

/* end of utilities */

// @route   GET api/backend/phases/phases
// @desc    Get all phases
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: phaseSelect,
      populate: phasePopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      findOptions = {
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
    const phase = await Phase.findById(req.params._id).populate(
      phasePopulationListForFindOne
    );
    if (!phase) {
      return res
        .status(404)
        .json({ errors: [phaseResponseTypes.PHASE_NOT_EXISTS] });
    }
    res.json(phase);
  } catch (err) {
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
    const { year, phaseNumber, events, isEnabled } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const phase = new Phase({
        year,
        phaseNumber,
        derivedLabel: getDerivedLabel(year, phaseNumber),
        events,
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
    const { year, phaseNumber, events, isEnabled } = req.body;

    // Build phase object
    // Note:
    // non-required fields do not need null check
    const phaseFields = {};
    if (year) phaseFields.year = year;
    if (phaseNumber > 0) phaseFields.phaseNumber = phaseNumber;
    if (year && phaseNumber > 0) {
      phaseFields.derivedLabel = getDerivedLabel(year, phaseNumber);
    }
    phaseFields.events = getArraySafe(events);
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

module.exports = router;