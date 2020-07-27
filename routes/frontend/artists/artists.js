const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const {
  Artist,
  artistRoles,
  artDirectorTypes,
  isArtDirector
} = require('../../../models/Artist');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const artistSelectForFindAll = {
  isFeaturedInLandingPage: 0,
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const artistSelectForFindOne = {
  ...artistSelectForFindAll
};

const relatedEventsSelectAndPopulationList = {
  select: {
    label: 1,
    name_tc: 1,
    name_sc: 1,
    name_en: 1,
    //artDirectors: 1,
    artists: 1,
    shows: 1
  },
  populate: [
    // {
    //   path: 'artDirectors',
    //   select: {
    //     label: 1,
    //     name_tc: 1,
    //     name_sc: 1,
    //     name_en: 1
    //   }
    // },
    {
      path: 'artists',
      select: {
        // Note: this select does not have any effect
        artist: 1,
        role_tc: 1,
        role_sc: 1,
        role_en: 1
      },
      populate: [
        {
          path: 'artist',
          select: {
            label: 1,
            name_tc: 1,
            name_sc: 1,
            name_en: 1,
            featuredImage: 1
          },
          populate: [
            {
              path: 'featuredImage',
              select: {
                url: 1
              }
            }
          ]
        }
      ]
    }
  ]
};

const artistPopulationListForFindAll = [
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
  {
    path: 'eventsDirected',
    ...relatedEventsSelectAndPopulationList
  },
  {
    path: 'eventsPerformed',
    ...relatedEventsSelectAndPopulationList
  }
];

const artistPopulationListForFindOne = [...artistPopulationListForFindAll];

const getArtistForFrontEndFromDbArtist = (dbArtist, language) => {
  const artist = dbArtist;

  const isDirector = isArtDirector(artist);

  // if (artist.eventsPerformed.length > 0) {
  //   //console.log(JSON.stringify(artist.eventsPerformed, null, 2));
  // }

  // gender
  let gender = 'boy';
  if (artist.role === artistRoles.FEMALE) {
    gender = 'girl';
  }

  // post
  let post = 'actor';
  if (isDirector) {
    post = 'art director';
  }

  const relatedEvents = getArraySafe(
    isDirector ? artist.eventsDirected : artist.eventsPerformed
  );

  const eventForFrontEndMapFunc = event => {
    // find the corresponding role of the artist in the event
    let artistRoleInEvent = null;

    if (!isDirector) {
      // Note: somehow using label to compare works, can't use _id to compare...
      const correspondingArtistWithRole = event.artists.find(
        artistWithRole => artistWithRole.artist.label === artist.label
      );
      if (correspondingArtistWithRole) {
        artistRoleInEvent = getEntityPropByLanguage(
          correspondingArtistWithRole,
          'role',
          language
        );
      }
    } else {
      // TODO: this is hard-coded...
      artistRoleInEvent = getEntityPropByLanguage(
        {
          role_tc: '藝術總監',
          role_sc: '艺术总监',
          role_en: 'Artistic Director'
        },
        'role',
        language
      );
    }

    return {
      id: event._id,
      label: event.label,
      name: getEntityPropByLanguage(event, 'name', language),
      // artDirectors: getArraySafe(event.artDirectors).map(artDirector => {
      //   return {
      //     id: artDirector._id,
      //     label: artDirector.label,
      //     name: getEntityPropByLanguage(artDirector, 'name', language)
      //   };
      // }),
      // still need artists for related artists field
      artists: getArraySafe(event.artists).map(artistWithRole => {
        const artist = artistWithRole.artist;
        return {
          id: artist._id,
          label: artist.label,
          name: getEntityPropByLanguage(artist, 'name', language),
          featuredImage: {
            src: artist.featuredImage && artist.featuredImage.url
          }
        };
      }),
      artistRole: artistRoleInEvent,
      shows: getArraySafe(event.shows)
    };
  };

  const { sortedEvents, closestEvent } = mapAndSortEvents(
    relatedEvents,
    eventForFrontEndMapFunc
  );

  // set relatedArtists
  let relatedArtists = [];
  if (closestEvent) {
    relatedArtists = getArraySafe(closestEvent.artists);
  }

  return {
    id: artist._id,
    label: artist.label,
    name: getEntityPropByLanguage(artist, 'name', language),
    gender: gender,
    post: post,
    featuredImage: {
      src: artist.featuredImage && artist.featuredImage.url
    },
    withoutMaskImage: {
      src: artist.withoutMaskImage && artist.withoutMaskImage.url
    },
    gallery: getArraySafe(artist.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    }),
    sound: artist.sound && artist.sound.url,
    description: getEntityPropByLanguage(artist, 'description', language),
    questions: getArraySafe(artist.qnas).map(qna => ({
      title: getEntityPropByLanguage(qna, 'question', language),
      answer: getEntityPropByLanguage(qna, 'answer', language)
    })),
    relatedEvents: sortedEvents,
    relatedArtists: relatedArtists
  };
};

const artistsGetHandling = async (req, res, isFindArtDirectors = false) => {
  try {
    const language = req.language;

    const findParams = {
      type: isFindArtDirectors
        ? {
            $in: artDirectorTypes
          }
        : {
            $not: {
              $in: artDirectorTypes
            }
          }
    };

    const artists = await getOrderingHandling(
      res,
      Artist,
      false,
      findParams,
      artistSelectForFindAll,
      {},
      artistPopulationListForFindAll
    );

    const artistsForFrontEnd = getArraySafe(artists).map(artist => {
      return getArtistForFrontEndFromDbArtist(artist, language);
    });

    // for (let i = 0; i < artistsForFrontEnd.length; i++) {
    //   console.log('');
    //   console.log('');
    //   console.log(i + ':');
    //   console.log(JSON.stringify(artistsForFrontEnd[i].relatedEvents, null, 2));
    //   console.log(artistsForFrontEnd[i].closestRelatedEvent);
    // }

    res.json(artistsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
};

/* end of utilities */

// @route   GET api/frontend/artists/:lang/artists
// @desc    Get all artists, not including art directors
// @access  Public
router.get('/:lang/artists', [languageHandling], async (req, res) => {
  await artistsGetHandling(req, res, false);
});

// @route   GET api/frontend/artists/:lang/artDirectors
// @desc    Get all art directors
// @access  Public
router.get('/:lang/artDirectors', [languageHandling], async (req, res) => {
  await artistsGetHandling(req, res, true);
});

// @route   GET api/frontend/artists/:lang/artists/:label
// @desc    Get artist by label
// @access  Public
router.get('/:lang/artists/:label', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const artist = await Artist.findOne({
      label: req.params.label
    })
      .select(artistSelectForFindOne)
      .populate(artistPopulationListForFindOne);

    const artistForFrontEnd = getArtistForFrontEndFromDbArtist(
      artist,
      language
    );

    res.json(artistForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
