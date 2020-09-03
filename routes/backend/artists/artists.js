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
const {
  getArraySafe,
  isNonEmptyArray
} = require('../../../utils/js/array/isNonEmptyArray');
const { Artist, artistResponseTypes } = require('../../../models/Artist');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');

/* utilities */

const artistSelectForFindAll = {
  eventsDirected: 0,
  eventsPerformed: 0
  //isFeaturedInLandingPage: 0
};

const artistSelectForFindOne = { ...artistSelectForFindAll };

const artistSelectForDeleteOne = {
  eventsDirected: 1,
  eventsPerformed: 1
  //isFeaturedInLandingPage: 1
};

const artistPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  {
    path: 'withoutMaskImage',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  {
    path: 'sound',
    select: mediumSelect
  },
  pageMetaPopulate
];

const artistPopulationListForFindOne = [...artistPopulationListForFindAll];

const artistValidationChecks = [
  check('label', artistResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('name_tc', artistResponseTypes.NAME_TC_REQUIRED).notEmpty(),
  check('name_sc', artistResponseTypes.NAME_SC_REQUIRED).notEmpty(),
  check('name_en', artistResponseTypes.NAME_EN_REQUIRED).notEmpty(),
  check('type', artistResponseTypes.TYPE_REQUIRED).notEmpty(),
  check('role', artistResponseTypes.ROLE_REQUIRED).notEmpty()
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
router.get('/', [auth, listingHandling], async (req, res) => {
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
      type,
      role,
      directorRemarks_tc,
      directorRemarks_sc,
      directorRemarks_en,
      desc_tc,
      desc_sc,
      desc_en,
      qnas,
      featuredImage,
      withoutMaskImage,
      gallery,
      sound,
      pageMeta,
      isEnabled
    } = req.body;

    // customed validations
    let isSuccess = artistRelationshipsValidation(qnas, res);
    if (!isSuccess) {
      return;
    }

    try {
      const artist = new Artist({
        label: label.trim(),
        name_tc,
        name_sc,
        name_en,
        type,
        role,
        directorRemarks_tc,
        directorRemarks_sc,
        directorRemarks_en,
        desc_tc,
        desc_sc,
        desc_en,
        qnas,
        featuredImage,
        withoutMaskImage,
        gallery: getArraySafe(gallery),
        sound,
        pageMeta,
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
      type,
      role,
      directorRemarks_tc,
      directorRemarks_sc,
      directorRemarks_en,
      desc_tc,
      desc_sc,
      desc_en,
      qnas,
      featuredImage,
      withoutMaskImage,
      gallery,
      sound,
      pageMeta,
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
    if (label) artistFields.label = label.trim();
    if (name_tc) artistFields.name_tc = name_tc;
    if (name_sc) artistFields.name_sc = name_sc;
    if (name_en) artistFields.name_en = name_en;
    if (type) artistFields.type = type;
    if (role) artistFields.role = role;
    artistFields.directorRemarks_tc = directorRemarks_tc;
    artistFields.directorRemarks_sc = directorRemarks_sc;
    artistFields.directorRemarks_en = directorRemarks_en;
    if (desc_tc) artistFields.desc_tc = desc_tc;
    if (desc_sc) artistFields.desc_sc = desc_sc;
    if (desc_en) artistFields.desc_en = desc_en;
    artistFields.qnas = getArraySafe(qnas);
    artistFields.featuredImage = featuredImage;
    artistFields.withoutMaskImage = withoutMaskImage;
    artistFields.gallery = getArraySafe(gallery);
    artistFields.sound = sound;
    artistFields.pageMeta = pageMeta;
    if (isEnabled !== undefined) artistFields.isEnabled = isEnabled;
    artistFields.lastModifyDT = new Date();
    artistFields.lastModifyUser = req.user._id;
    // set order to null if disabled
    if (isEnabled === false) artistFields.order = null;

    try {
      let artist = await Artist.findById(req.params._id);

      if (!artist) {
        return res
          .status(404)
          .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
      }

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

// @route   DELETE api/backend/artists/artists/:_id
// @desc    Delete artist
// @access  Private
router.delete('/:_id', [auth], async (req, res) => {
  try {
    let artist = await Artist.findById(req.params._id).select(
      artistSelectForDeleteOne
    );

    if (!artist) {
      return res
        .status(404)
        .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
    }

    /* delete check */

    const deleteCheckFailResponse = errorType => {
      // 400 bad request
      return res.status(400).json({ errors: [errorType] });
    };

    if (isNonEmptyArray(artist.eventsPerformed)) {
      return deleteCheckFailResponse(
        artistResponseTypes.ARTIST_PERFORMED_IN_EVENTS
      );
    }

    if (isNonEmptyArray(artist.eventsDirected)) {
      return deleteCheckFailResponse(
        artistResponseTypes.ARTIST_DIRECTED_IN_EVENTS
      );
    }

    // if (artist.isFeaturedInLandingPage) {
    //   return deleteCheckFailResponse(
    //     artistResponseTypes.ARTIST_FEATURED_IN_LANDING
    //   );
    // }

    /* end of delete check */

    await Artist.findByIdAndDelete(req.params._id);

    res.sendStatus(200);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
