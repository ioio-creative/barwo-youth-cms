const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const mediumTypeValidate = require('../../../middleware/media/mediumTypeValidate');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { Medium, mediumResponseTypes } = require('../../../models/Medium');
const { MediumTag } = require('../../../models/MediumTag');

/* utilities */

const mediumSelectForFindAll = {};
const mediumSelectForFindOne = { ...mediumSelectForFindAll };
const mediumPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];
const mediumPopulationListForFindOne = [...mediumPopulationListForFindAll];

const mediumValidationChecks = [
  check('name', mediumResponseTypes.NAME_REQUIRED).not().isEmpty(),
  check('type', mediumResponseTypes.TYPE_REQUIRED).not().isEmpty(),
  check('url', mediumResponseTypes.URL_REQUIRED).not().isEmpty()
];

const handleMediumNameDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'name',
    mediumResponseTypes.NAME_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

const setMediumForTags = async (mediumId, tags, session) => {
  const options = { session };

  // set tag's media
  for (const tag of getArraySafe(tags)) {
    // tag is tag's _id
    await MediumTag.findByIdAndUpdate(
      tag,
      {
        $addToSet: {
          media: mediumId
        }
      },
      options
    );
  }
};

const removeMediumForTags = async (medium, session) => {
  const options = { session };

  for (const tag of getArraySafe(medium.tags)) {
    await MediumTag.findByIdAndUpdate(
      tag,
      {
        $pull: {
          media: medium._id
        }
      },
      options
    );
  }
};

/* end of utilities */

// @route   GET api/backend/media/:mediaType
// @desc    Get all media of a particular mediaType, e.g. 'images', 'videos', etc.
// @access  Private
router.get(
  '/:mediaType',
  [mediumTypeValidate, auth, listPathHandling],
  async (req, res) => {
    try {
      const mediumTypeFromUrl = req.mediumType;

      const options = {
        ...req.paginationOptions,
        select: mediumSelectForFindAll,
        populate: mediumPopulationListForFindAll
      };

      let findOptions = {};
      const filterTextRegex = req.filterTextRegex;
      if (filterTextRegex) {
        findOptions = {
          name: filterTextRegex,
          type: mediumTypeFromUrl.type
        };
      }

      const media = await Medium.paginate(findOptions, options);
      res.json(media);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   GET api/backend/media/:mediaType/:_id
// @desc    Get medium of a particular mediaType, e.g. 'images', 'videos', etc, by id
// @access  Private
router.get('/:mediaType/:_id', [mediumTypeValidate, auth], async (req, res) => {
  const mediumTypeFromUrl = req.mediumType;
  const mediumIdFromUrl = req.params._id;

  try {
    const medium = await Medium.findById(mediumIdFromUrl)
      .select(mediumSelectForFindOne)
      .populate(mediumPopulationListForFindOne);
    if (!medium || medium.type !== mediumTypeFromUrl.type) {
      return res
        .status(404)
        .json({ errors: [mediumResponseTypes.MEDIUM_NOT_EXISTS] });
    }
    res.json(medium);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [mediumResponseTypes.MEDIUM_NOT_EXISTS] });
  }
});

// @route   POST api/backend/media/:mediaType
// @desc    Add medium of a particular mediaType, e.g. 'images', 'videos', etc.
// @access  Private
router.post(
  '/:mediaType',
  [mediumTypeValidate, auth, mediumValidationChecks, validationHandling],
  async (req, res) => {
    const {
      name,
      alernativeText,
      url,
      tags,
      //usages,
      isEnabled
    } = req.body;
    const type = req.mediumType.type;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const medium = new Medium({
        name,
        alernativeText,
        type,
        url,
        tags,
        //usages,
        isEnabled,
        lastModifyUser: req.user._id
      });

      await medium.save({ session });

      await setMediumForTags(medium._id, tags, session);

      await session.commitTransaction();

      res.json(medium);
    } catch (err) {
      await session.abortTransaction();
      if (!handleMediumNameDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

// @route   PUT api/backend/media/:mediumType/:_id
// @desc    Update medium of a particular mediaType, e.g. 'images', 'videos', etc.
// @access  Private
router.put(
  '/:mediaType/:_id',
  [mediumTypeValidate, auth, mediumValidationChecks, validationHandling],
  async (req, res) => {
    const {
      name,
      alernativeText,
      url,
      tags,
      //usages,
      isEnabled
    } = req.body;
    const type = req.mediumType.type;

    // Build medium object
    // Note:
    // non-required fields do not need null check
    const mediumFields = {};
    if (name) mediumFields.name = name;
    mediumFields.alernativeText = alernativeText;
    if (url) mediumFields.url = url;
    mediumFields.tags = tags;
    //mediumFields.usages = usages;
    if (isEnabled !== undefined) mediumFields.isEnabled = isEnabled;
    mediumFields.lastModifyDT = new Date();
    mediumFields.lastModifyUser = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const mediumId = req.params._id;

    try {
      const oldMedium = await Medium.findById(mediumId).session(session);
      if (!oldMedium)
        return res
          .status(404)
          .json({ errors: [mediumResponseTypes.MEDIUM_NOT_EXISTS] });

      await removeMediumForTags(oldMedium, session);

      const newMedium = await Medium.findByIdAndUpdate(
        mediumId,
        { $set: mediumFields },
        { session, new: true }
      );

      await setMediumForTags(mediumId, newMedium.tags, session);

      await session.commitTransaction();

      res.json(newMedium);
    } catch (err) {
      await session.abortTransaction();
      if (!handleMediumNameDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
