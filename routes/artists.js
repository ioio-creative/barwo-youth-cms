const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const { generalErrorHandle } = require('../utils/errorHandling');
const { returnValidationResults } = require('../utils/validationHandling');
const { Artist, artistResponseTypes } = require('../models/Artist');

const artistValidationChecks = [
  check('name_tc', artistResponseTypes.NAME_TC_REQUIRED).not().isEmpty(),
  check('name_sc', artistResponseTypes.NAME_SC_REQUIRED).not().isEmpty(),
  check('name_en', artistResponseTypes.NAME_EN_REQUIRED).not().isEmpty(),
  check('type', artistResponseTypes.TYPE_REQUIRED).not().isEmpty(),
  check('role', artistResponseTypes.ROLE_REQUIRED).not().isEmpty()
];

// @route   GET api/artists
// @desc    Get all artists
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // https://mongoosejs.com/docs/populate.html
    const artists = await Artist.find({})
      .populate('lastModifyUser', 'name')
      .sort({
        lastModifyDT: -1
      });
    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/artists/:_id
// @desc    Get artist by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params._id).populate(
      'lastModifyUser',
      'name'
    );
    if (!artist) {
      return res
        .status(404)
        .json({ type: artistResponseTypes.ARTIST_NOT_EXISTS });
    }
    res.json(artist);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ type: artistResponseTypes.ARTIST_NOT_EXISTS });
  }
});

// @route   POST api/artists
// @desc    Add artist
// @access  Private
router.post('/', [auth, artistValidationChecks], async (req, res) => {
  // validation
  const isValidationPassed = returnValidationResults(req, res);
  if (!isValidationPassed) {
    return;
  }

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
});

// @route   PUT api/artists/:_id
// @desc    Update artist
// @access  Private
router.put('/:_id', [auth, artistValidationChecks], async (req, res) => {
  // validation
  const isValidationPassed = returnValidationResults(req, res);
  if (!isValidationPassed) {
    return;
  }

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
  const artistFields = {};
  if (name_tc) artistFields.name_tc = name_tc;
  if (name_sc) artistFields.name_sc = name_sc;
  if (name_en) artistFields.name_en = name_en;
  if (desc_tc) artistFields.desc_tc = desc_tc;
  if (desc_sc) artistFields.desc_sc = desc_sc;
  if (desc_en) artistFields.desc_en = desc_en;
  if (type) artistFields.type = type;
  if (role) artistFields.role = role;
  if (isEnabled !== undefined) artistFields.isEnabled = isEnabled;
  artistFields.lastModifyDT = new Date();
  artistFields.lastModifyUser = req.user._id;

  try {
    let artist = await Artist.findById(req.params._id);
    if (!artist)
      return res
        .status(404)
        .json({ type: artistResponseTypes.ARTIST_NOT_EXISTS });

    artist = await Artist.findByIdAndUpdate(
      req.params._id,
      { $set: artistFields },
      { new: true }
    );

    res.json(artist);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
