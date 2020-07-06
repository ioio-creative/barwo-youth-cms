const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Artist, artistRoles, artistTypes } = require('../../../models/Artist');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');

/* utilities */

const artistSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const artistPopulationListForFindAll = [
  {
    path: 'featuredImage',
    select: {
      url: 1
    }
  },
  {
    path: 'withoutMaskImage',
    select: {
      url: 1
    }
  },
  {
    path: 'gallery',
    select: {
      url: 1
    }
  },
  {
    path: 'sound',
    select: {
      url: 1
    }
  }
];

/* end of utilities */

// @route   GET api/backend/artists/artists
// @desc    Get all artists
// @access  Public
router.get('/:_lang', async (req, res) => {
  try {
    const lang = req.params.lang;

    const artists = await Artist.find({
      isEnabled: true
    })
      .select(artistSelectForFindAll)
      .populate(artistPopulationListForFindAll);

    const artistsForFrontEnd = artists.map(artist => {
      // gender
      let gender = 'boy';
      if (artist.role === artistRoles.FEMALE) {
        gender = 'girl';
      }

      // post
      let post = 'actor';
      if (
        [artistTypes.ART_DIRECTOR, artistTypes.ART_DIRECTOR_VISITING].includes(
          artist.type
        )
      ) {
        post = 'art director';
      }
      return {
        name: artist.name,
        gender: gender,
        post: post,
        featuredImage: {
          src: artist.featuredImage && artist.featuredImage.url
        },

        gallery: getArraySafe(artist.gallery).map(medium => {
          return {
            src: medium && medium.src
          };
        }),
        sound: artist.sound && artist.sound.src,
        description: artist.description,
        questions: getArraySafe(artist.qnas).map()
      };
    });

    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});
