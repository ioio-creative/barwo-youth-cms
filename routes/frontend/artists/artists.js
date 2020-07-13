const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  Artist,
  artistRoles,
  isArtDirector
} = require('../../../models/Artist');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const sortEvents = require('../../../utils/events/sortEvents');

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

  // set relatedEventsForFrontEnd
  const relatedEventsForFrontEnd = relatedEvents.map(event => {
    // find the corresponding role of the artist in the event
    let artistRoleInEvent = null;
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
      // artists: getArraySafe(event.artists).map(artistWithRole => {
      //   const artist = artistWithRole.artist;
      //   return {
      //     id: artist._id,
      //     label: artist.label,
      //     name: getEntityPropByLanguage(artist, 'name', language),
      //     featuredImage: {
      //       src: artist.featuredImage && artist.featuredImage.url
      //     }
      //   };
      // }),
      artistRole: artistRoleInEvent,
      shows: getArraySafe(event.shows)
    };
  });

  // set relatedArtists
  let relatedArtists = [];
  if (closestRelatedEventForFrontEnd) {
    relatedArtists = getArraySafe(closestRelatedEventForFrontEnd.artists);
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
    relatedEvents: sortEvents(relatedEventsForFrontEnd),

    relatedArtists: relatedArtists
  };
};

/* end of utilities */

// @route   GET api/frontend/artists/:lang/artists
// @desc    Get all artists
// @access  Public
router.get('/:lang/artists', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const artists = await Artist.find({
      isEnabled: true
    })
      .select(artistSelectForFindAll)
      .populate(artistPopulationListForFindAll)
      .sort({
        name_tc: 1
      });

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
