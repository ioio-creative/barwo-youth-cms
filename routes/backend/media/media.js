const util = require('util');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const config = require('config');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const mediumTypeValidate = require('../../../middleware/media/mediumTypeValidate');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const prettyStringify = require('../../../utils/JSON/prettyStringify');
const { Medium, mediumResponseTypes } = require('../../../models/Medium');
const { MediumTag } = require('../../../models/MediumTag');

/* s3 utils */
// https://www.npmjs.com/package/multer-s3

const changeFileName = originalName => {
  const extWithDot = path.extname(originalName);
  const nameWithoutExt = originalName.substr(0, originalName.lastIndexOf('.'));
  return `${nameWithoutExt}-${Date.now()}${extWithDot}`;
};

const s3 = new aws.S3({
  accessKeyId: config.get('Aws.s3.accessKeyId'),
  secretAccessKey: config.get('Aws.s3.secretAccessKey'),
  region: config.get('Aws.s3.region')
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.get('Aws.s3.bucket'),
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // https://stackoverflow.com/questions/44028876/how-to-specify-upload-directory-in-multer-s3-for-aws-s3-bucket
    key: function (req, file, cb) {
      const changedFileName = changeFileName(file.originalname);
      const fullPath = `files/${req.mediumType.route}/${changedFileName}`;
      cb(null, fullPath);
    }
  }),
  // https://www.npmjs.com/package/multer#limits
  limits: {
    // https://stackoverflow.com/questions/56640410/cant-upload-large-files-to-aws-with-multer-s3-nodejs
    fileSize: config.get('Aws.s3.limits.fileSizeInMBs') * 1024 * 1024,
    files: config.get('Aws.s3.limits.files')
  },
  // https://www.npmjs.com/package/multer
  fileFilter: async function (req, file, cb) {
    let isAllowed = false;

    const mediumTypeFromUrl = req.mediumType;

    if (mediumTypeFromUrl.allowedMimeTypes.includes(file.mimetype)) {
      isAllowed = true;
    } else {
      console.log('mime types allowed:');
      console.log(mediumTypeFromUrl.allowedMimeTypes);
      console.log('file uploaded:');
      console.log(file);
    }

    cb(null, isAllowed);
  }
});

const getUploadMultipleFilesMiddleware = fieldName =>
  util.promisify(upload.array(fieldName, config.get('Aws.s3.limits.files')));

const getUploadSingleFilesMiddleware = fieldName =>
  util.promisify(upload.single(fieldName, config.get('Aws.s3.limits.files')));

const uploadMultipleFilesMiddleware = getUploadMultipleFilesMiddleware('media');

const uploadSingleFilesMiddleware = getUploadSingleFilesMiddleware('media');

/* end of s3 utils */

/* utilities */

const mediumSelectForFindAll = {
  usages: 0
};
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

// @route   GET api/backend/media/:mediumType
// @desc    Get all media of a particular mediumType, e.g. 'images', 'videos', etc.
// @access  Private
router.get(
  '/:mediumType',
  [mediumTypeValidate, auth, listPathHandling],
  async (req, res) => {
    try {
      const mediumTypeFromUrl = req.mediumType;

      const options = {
        ...req.paginationOptions,
        select: mediumSelectForFindAll,
        populate: mediumPopulationListForFindAll
      };

      let findOptions = { type: mediumTypeFromUrl.type };
      const filterTextRegex = req.filterTextRegex;
      if (filterTextRegex) {
        findOptions = {
          ...findOptions,
          name: filterTextRegex
        };
      }

      const media = await Medium.paginate(findOptions, options);
      res.json(media);

      console.log(media.docs.map(medium => medium.type));
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @route   GET api/backend/media/:mediumType/:_id
// @desc    Get medium of a particular mediumType, e.g. 'images', 'videos', etc, by id
// @access  Private
router.get(
  '/:mediumType/:_id',
  [mediumTypeValidate, auth],
  async (req, res) => {
    const mediumTypeFromUrl = req.mediumType;
    const mediumIdFromUrl = req.params._id;

    try {
      const medium = await Medium.findById(mediumIdFromUrl)
        .select(mediumSelectForFindOne)
        .populate(mediumPopulationListForFindOne);
      if (!medium) {
        return res
          .status(404)
          .json({ errors: [mediumResponseTypes.MEDIUM_NOT_EXISTS] });
      }
      if (medium.type !== mediumTypeFromUrl.type) {
        // 400 bad request
        return res.status(400).json({
          errors: [mediumResponseTypes.WRONG_TYPE]
        });
      }
      res.json(medium);
    } catch (err) {
      //generalErrorHandle(err, res);
      return res
        .status(404)
        .json({ errors: [mediumResponseTypes.MEDIUM_NOT_EXISTS] });
    }
  }
);

// @route   POST api/backend/media/:mediumType
// @desc    Add medium of a particular mediumType, e.g. 'images', 'videos', etc.
// @access  Private
router.post('/:mediumType', [mediumTypeValidate, auth], async (req, res) => {
  try {
    /* upload to s3 */

    //await uploadMultipleFilesMiddleware(req, res);
    await uploadSingleFilesMiddleware(req, res);

    //const files = req.files;
    const file = req.file;

    console.log('files uploaded to s3:');
    console.log(file);

    if (!file) {
      // 400 bad request
      return res.status(400).json({
        errors: [mediumResponseTypes.NO_FILE_UPLOADED_OR_OF_WRONG_TYPE]
      });
    }

    /* save to db */

    const {
      alernativeText,
      tags,
      //usages,
      isEnabled
    } = req.body;
    const name = path.basename(file.key);
    const type = req.mediumType.type;
    const url = file.location;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const medium = new Medium({
        name,
        alernativeText,
        type,
        url,
        tags: getArraySafe(tags),
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
  } catch (err) {
    console.error(prettyStringify(err));

    const badRequestCode = 400;
    let errorType = null;

    // https://www.npmjs.com/package/multer
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_COUNT':
          errorType = mediumResponseTypes.TOO_MANY_FILES;
          break;
        case 'LIMIT_FILE_SIZE':
          errorType = mediumReponseType.FILE_TOO_LARGE;
        default:
          break;
      }

      if (errorType) {
        return res.status(badRequestCode).json({
          errors: [errorType]
        });
      }
    }

    if (!errorType) {
      generalErrorHandle(err, res);
    }
  }
});

// @route   PUT api/backend/media/:mediumType/:_id
// @desc    Update medium of a particular mediumType, e.g. 'images', 'videos', etc.
// @access  Private
router.put(
  '/:mediumType/:_id',
  [mediumTypeValidate, auth, mediumValidationChecks, validationHandling],
  async (req, res) => {
    const {
      name,
      alernativeText,
      //type,
      tags,
      //url,
      //usages,
      isEnabled
    } = req.body;

    const mediumTypeFromUrl = req.mediumType;

    // Build medium object
    // Note:
    // non-required fields do not need null check
    const mediumFields = {};
    if (name) mediumFields.name = name;
    mediumFields.alernativeText = alernativeText;
    mediumFields.tags = tags;
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
      if (oldMedium.type !== mediumTypeFromUrl.type) {
        // 400 bad request
        return res.status(400).json({
          errors: [mediumResponseTypes.WRONG_TYPE]
        });
      }

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
