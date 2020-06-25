const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const listPathHandling = require('../../../middleware/listingPathHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getFindLikeTextRegex = require('../../../utils/regex/getFindLikeTextRegex');
const { Artist, artistResponseTypes } = require('../../../models/Artist');

const artistValidationChecks = [
  check('name_tc', artistResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', artistResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', artistResponseTypes.NAME_EN_REQUIRED).not().isEmpty(),
  check('type', artistResponseTypes.TYPE_REQUIRED).not().isEmpty(),
  check('role', artistResponseTypes.ROLE_REQUIRED).not().isEmpty()
];

const artistSelect = {
  eventsDirected: 0,
  eventsPerformed: 0
};

// @route   GET api/backend/artists/artists
// @desc    Get all artists
// @access  Private
router.get('/', [auth, listPathHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: artistSelect
    };

    // queries
    const filterText = req.query.filterText;

    let findOptions = {};
    if (!['', null, undefined].includes(filterText)) {
      const filterTextRegex = getFindLikeTextRegex(filterText);
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        $or: [
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
      .select(artistSelect)
      .populate('lastModifyUser', 'name');
    if (!artist) {
      return res
        .status(404)
        .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
    }
    res.json(artist);
  } catch (err) {
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
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      type,
      role,
      isEnabled
    } = req.body;

    try {
      const artist = new Artist({
        name_tc,
        name_sc,
        name_en,
        desc_tc,
        desc_sc,
        desc_en,
        type,
        role,
        isEnabled,
        lastModifyUser: req.user._id
      });
      await artist.save();

      res.json(artist);
    } catch (err) {
      generalErrorHandle(err, res);
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
      name_tc,
      name_sc,
      name_en,
      desc_tc,
      desc_sc,
      desc_en,
      type,
      role,
      isEnabled
    } = req.body;

    // Build artist object
    // Note:
    // non-required fields do not need null check
    const artistFields = {};
    if (name_tc) artistFields.name_tc = name_tc;
    if (name_sc) artistFields.name_sc = name_sc;
    if (name_en) artistFields.name_en = name_en;
    if (desc_tc) artistFields.desc_tc = desc_tc;
    if (desc_sc) artistFields.desc_sc = desc_sc;
    if (desc_en) artistFields.desc_en = desc_en;
    artistFields.type = type;
    if (role) artistFields.role = role;
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
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
