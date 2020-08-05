const util = require('util');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const config = require('config');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listingHandling = require('../../../middleware/listingHandling');
const mediumTypeValidate = require('../../../middleware/media/mediumTypeValidate');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const firstOrDefault = require('../../../utils/js/array/firstOrDefault');
const prettyStringify = require('../../../utils/JSON/prettyStringify');
const {
  Medium,
  mediumResponseTypes,
  mediumTypes,
  mediumTypesArray
} = require('../../../models/Medium');
const { MediumTag } = require('../../../models/MediumTag');

/* constants */

const awsAccessKeyId = config.get('Aws.accessKeyId');
const awsSecretAccessKey = config.get('Aws.secretAccessKey');

const awsS3Region = config.get('Aws.s3.region');
const awsS3Bucket = config.get('Aws.s3.bucket');
const awsS3LimitsFileSizeInMbs = config.get('Aws.s3.limits.fileSizeInMBs');
const awsS3LimitsFiles = config.get('Aws.s3.limits.files');

const imageWidthCeiling = config.get('Media.image.widthCeiling');
const imageHeightCeiling = config.get('Media.image.heightCeiling');

const resizeImageTransformId = 'resizeImage';

/* end of constants */

/* s3 utils */
// https://www.npmjs.com/package/multer-s3
// https://www.npmjs.com/package/multer-s3-transform (same thing?)

const getNewFileName = originalName => {
  const extWithDot = path.extname(originalName);
  const nameWithoutExt = originalName.substr(0, originalName.lastIndexOf('.'));
  return `${nameWithoutExt}-${Date.now()}${extWithDot}`;
};

const getFileKey = (mediumTypeObj, fileOriginalName) => {
  const newFileName = getNewFileName(fileOriginalName);
  return `files/${mediumTypeObj.route}/${newFileName}`;
};

// to cater for mediumTypeFromUrl.type === mediumTypes.ALL.type case
const changeReqMediumTypeIfItEqualsAllType = (req, fileMimeType) => {
  if (req.mediumType.type === mediumTypes.ALL.type) {
    for (let mediumType of mediumTypesArray) {
      if (mediumType.allowedMimeTypes.includes(fileMimeType)) {
        req.mediumType = mediumType;
        break;
      }
    }
  }
};

const s3 = new aws.S3({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: awsS3Region
});

/**
 * Note:
 * upload middleware would change req.mediumType
 * to a specific mediumType if req.mediumType === mediumTypes.ALL
 * See storage field.
 */
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: awsS3Bucket,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // https://stackoverflow.com/questions/44028876/how-to-specify-upload-directory-in-multer-s3-for-aws-s3-bucket
    key: function (req, file, cb) {
      // to cater for mediumTypeFromUrl.type === mediumTypes.ALL.type case
      changeReqMediumTypeIfItEqualsAllType(req, file.mimetype);

      const fullPath = getFileKey(req.mediumType, file.originalname);
      cb(null, fullPath);
    },
    // https://www.npmjs.com/package/multer-s3-transform
    shouldTransform: function (req, file, cb) {
      // to cater for mediumTypeFromUrl.type === mediumTypes.ALL.type case
      changeReqMediumTypeIfItEqualsAllType(req, file.mimetype);

      let isTransformRequired = false;

      if (
        req.mediumType.type === mediumTypes.IMAGE.type &&
        mediumTypes.IMAGE.resizableMimeTypes.includes(file.mimetype)
      ) {
        const width = req.query.width;
        const height = req.query.height;
        if (width && height) {
          const isHorizontal = width >= height;
          isTransformRequired =
            (isHorizontal && width > imageWidthCeiling) ||
            (!isHorizontal && height > imageHeightCeiling);
        }
      }

      cb(null, isTransformRequired);
    },
    // https://stackoverflow.com/questions/45281726/how-to-resize-an-image-and-upload-using-multer-in-nodejs-to-s3-and-using-easy-im
    transforms: [
      {
        id: resizeImageTransformId,
        key: function (req, file, cb) {
          const fullPath = getFileKey(req.mediumType, file.originalname);
          cb(null, fullPath);
        },
        transform: function (req, file, cb) {
          let transformFunc = null;

          if (
            req.mediumType.type === mediumTypes.IMAGE.type &&
            mediumTypes.IMAGE.resizableMimeTypes.includes(file.mimetype)
          ) {
            const width = req.query.width;
            const height = req.query.height;
            if (width && height) {
              isHorizontal = width >= height;
              transformFunc = sharp().resize({
                width: isHorizontal ? imageWidthCeiling : null,
                height: !isHorizontal ? imageHeightCeiling : null,
                fit: 'contain'
              });
            }
          }
          cb(null, transformFunc);
        }
      }
    ]
  }),
  // https://www.npmjs.com/package/multer#limits
  limits: {
    // https://stackoverflow.com/questions/56640410/cant-upload-large-files-to-aws-with-multer-s3-nodejs
    fileSize: awsS3LimitsFileSizeInMbs * 1024 * 1024,
    files: awsS3LimitsFiles
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
  util.promisify(upload.array(fieldName, awsS3LimitsFiles));

const getUploadSingleFilesMiddleware = fieldName =>
  util.promisify(upload.single(fieldName));

const uploadMultipleFilesMiddleware = getUploadMultipleFilesMiddleware('media');

const uploadSingleFilesMiddleware = getUploadSingleFilesMiddleware('media');

/* end of s3 utils */

/* utilities */

const mediumSortForFindAll = {
  lastModifyDT: -1
};

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
  check('name', mediumResponseTypes.NAME_REQUIRED).notEmpty(),
  check('type', mediumResponseTypes.TYPE_REQUIRED).notEmpty(),
  check('url', mediumResponseTypes.URL_REQUIRED).notEmpty()
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
  [mediumTypeValidate, auth, listingHandling],
  async (req, res) => {
    try {
      const mediumTypeFromUrl = req.mediumType;

      const options = {
        ...req.paginationOptions,
        select: mediumSelectForFindAll,
        populate: mediumPopulationListForFindAll,
        sort: mediumSortForFindAll
      };

      let findOptions = {};

      if (mediumTypeFromUrl.type !== mediumTypes.ALL.type) {
        findOptions.type = mediumTypeFromUrl.type;
      }

      const filterTextRegex = req.filterTextRegex;
      if (filterTextRegex) {
        findOptions = {
          ...findOptions,
          name: filterTextRegex
        };
      }

      const media = await Medium.paginate(findOptions, options);
      res.json(media);
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
      console.error(err);
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
// Note: req.query may contain width and height if the file uploaded is an image
// e.g. req.query.width, req.query.height
router.post('/:mediumType', [mediumTypeValidate, auth], async (req, res) => {
  try {
    /* upload to s3 */

    //await uploadMultipleFilesMiddleware(req, res);
    await uploadSingleFilesMiddleware(req, res);

    /**
     * Note:
     * uploadMultipleFilesMiddleware would change req.mediumType
     * to a specific mediumType if req.mediumType === mediumTypes.ALL
     */
    //console.log(req.mediumType);

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

    // const {
    //   alernativeText,
    //   tags,
    //   //usages,
    //   isEnabled
    // } = req.body;

    const resizeImageTransform = firstOrDefault(
      getArraySafe(file.transforms).filter(
        transform => transform.id === resizeImageTransformId
      ),
      null
    );

    const name = path.basename(
      file.key || (resizeImageTransform ? resizeImageTransform.key : '')
    );
    const type = req.mediumType.type;
    const url =
      file.location ||
      (resizeImageTransform ? resizeImageTransform.location : '');

    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const medium = new Medium({
        name,
        //alernativeText,
        type,
        url,
        //tags: getArraySafe(tags),
        //usages,
        //isEnabled,
        lastModifyUser: req.user._id
      });

      //await medium.save({ session });
      medium.save();

      //await setMediumForTags(medium._id, tags, session);

      //await session.commitTransaction();

      res.json(medium);
    } catch (err) {
      //await session.abortTransaction();
      if (!handleMediumNameDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    } finally {
      //session.endSession();
    }
  } catch (err) {
    console.error(prettyStringify(err));

    let errorType = null;

    // https://www.npmjs.com/package/multer
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_COUNT':
          errorType = mediumResponseTypes.TOO_MANY_FILES;
          break;
        case 'LIMIT_FILE_SIZE':
          errorType = mediumResponseTypes.FILE_TOO_LARGE;
        default:
          break;
      }

      if (errorType) {
        // 400 bad request
        return res.status(400).json({
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
      // alernativeText,
      //type,
      // tags,
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
    // mediumFields.alernativeText = alernativeText;
    // mediumFields.tags = tags;
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

      // await setMediumForTags(mediumId, newMedium.tags, session);

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
