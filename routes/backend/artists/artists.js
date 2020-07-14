const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const {
  generalErrorHandle,
  duplicateKeyErrorHandle
} = require('../../../utils/errorHandling');
const { Artist, artistResponseTypes } = require('../../../models/Artist');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');

/* utilities */

const artistSelectForFindAll = {
  eventsDirected: 0,
  eventsPerformed: 0,
  isFeaturedInLandingPage: 0
};

const artistSelectForFindOne = { ...artistSelectForFindAll };

const artistPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  },
  {
    path: 'withoutMaskImage',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
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
  },
  {
    path: 'sound',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  }
];

const artistPopulationListForFindOne = [...artistPopulationListForFindAll];

const artistValidationChecks = [
  check('label', artistResponseTypes.LABEL_REQUIRED).not().isEmpty(),
  check('name_tc', artistResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', artistResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', artistResponseTypes.NAME_EN_REQUIRED).not().isEmpty(),
  check('type', artistResponseTypes.TYPE_REQUIRED).not().isEmpty(),
  check('role', artistResponseTypes.ROLE_REQUIRED).not().isEmpty()
];

const eventQnasValidation = qnas => {
  for (const qna of getArraySafe(qnas)) {
    let errorType = null;

    if (!qna.question_tc) {
      errorType = artistResponseTypes.ARTIST_QnA_QUESTION_TC_REQUIRED;
    } else if (!qna.answer_tc) {
      errorType = artistResponseTypes.ARTIST_QnA_ANSWER_TC_REQUIRED;
    } else if (!qna.question_sc) {
      errorType = artistResponseTypes.ARTIST_QnA_QUESTION_SC_REQUIRED;
    } else if (!qna.answer_sc) {
      errorType = artistResponseTypes.ARTIST_QnA_ANSWER_SC_REQUIRED;
    } else if (!qna.question_en) {
      errorType = artistResponseTypes.ARTIST_QnA_QUESTION_EN_REQUIRED;
    } else if (!qna.answer_en) {
      errorType = artistResponseTypes.ARTIST_QnA_ANSWER_EN_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const handleArtistLabelDuplicateKeyError = (err, res) => {
  const isErrorHandled = duplicateKeyErrorHandle(
    err,
    'label',
    artistResponseTypes.LABEL_ALREADY_EXISTS,
    res
  );
  return isErrorHandled;
};

const handleArtistRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const artistRelationshipsValidation = (qnas, res) => {
  let errorType = null;

  errorType = eventQnasValidation(qnas);
  if (errorType) {
    handleArtistRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

/* end of utilites */

// @route   GET api/backend/artists/artists
// @desc    Get all artists
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: artistSelectForFindAll,
      populate: artistPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        ...findOptions,
        $or: [
          { label: filterTextRegex },
          { name_tc: filterTextRegex },
          { name_sc: filterTextRegex },
          { name_en: filterTextRegex }
          // { desc_tc: filterTextRegex },
          // { desc_sc: filterTextRegex },
          // { desc_en: filterTextRegex }
        ]
      };
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const artists = await Artist.paginate(findOptions, options);
    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/artists/artists/:_id
// @desc    Get artist by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params._id)
      .select(artistSelectForFindOne)
      .populate(artistPopulationListForFindOne);
    if (!artist) {
      return res
        .status(404)
        .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
    }
    res.json(artist);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
  }
});

// @route   POST api/backend/artists/artists
// @desc    Add artist
// @access  Private
router.post(
  '/',
  [auth, artistValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      type,
      role,
      qnas,
      featuredImage,
      withoutMaskImage,
      gallery,
      sound,
      isEnabled
    } = req.body;

    // customed validations
    let isSuccess = artistRelationshipsValidation(qnas, res);
    if (!isSuccess) {
      return;
    }

    try {
      const artist = new Artist({
        label,
        name_tc,
        name_sc,
        name_en,
        desc_tc,
        desc_sc,
        desc_en,
        type,
        role,
        qnas,
        featuredImage,
        withoutMaskImage,
        gallery: getArraySafe(gallery),
        sound,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await artist.save();

      res.json(artist);
    } catch (err) {
      if (!handleArtistLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

// @route   PUT api/backend/artists/artists/:_id
// @desc    Update artist
// @access  Private
router.put(
  '/:_id',
  [auth, artistValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      type,
      role,
      qnas,
      featuredImage,
      withoutMaskImage,
      gallery,
      sound,
      isEnabled
    } = req.body;

    // customed validations
    let isSuccess = artistRelationshipsValidation(qnas, res);
    if (!isSuccess) {
      return;
    }

    // Build artist object
    // Note:
    // non-required fields do not need null check
    const artistFields = {};
    if (label) artistFields.label = label;
    if (name_tc) artistFields.name_tc = name_tc;
    if (name_sc) artistFields.name_sc = name_sc;
    if (name_en) artistFields.name_en = name_en;
    if (desc_tc) artistFields.desc_tc = desc_tc;
    if (desc_sc) artistFields.desc_sc = desc_sc;
    if (desc_en) artistFields.desc_en = desc_en;
    if (type) artistFields.type = type;
    if (role) artistFields.role = role;
    artistFields.qnas = getArraySafe(qnas);
    artistFields.featuredImage = featuredImage;
    artistFields.withoutMaskImage = withoutMaskImage;
    artistFields.gallery = getArraySafe(gallery);
    artistFields.sound = sound;
    if (isEnabled !== undefined) artistFields.isEnabled = isEnabled;
    artistFields.lastModifyDT = new Date();
    artistFields.lastModifyUser = req.user._id;

    try {
      let artist = await Artist.findById(req.params._id);
      if (!artist)
        return res
          .status(404)
          .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });

      artist = await Artist.findByIdAndUpdate(
        req.params._id,
        { $set: artistFields },
        { new: true }
      );

      res.json(artist);
    } catch (err) {
      if (!handleArtistLabelDuplicateKeyError(err, res)) {
        generalErrorHandle(err, res);
      }
    }
  }
);

module.exports = router;
