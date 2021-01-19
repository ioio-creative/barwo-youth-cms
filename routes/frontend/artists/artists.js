const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  isNonEmptyArray,
  getArraySafe
} = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const mapAndSortEvents = require('../../../utils/events/mapAndSortEvents');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  Artist,
  artistRoles,
  artDirectorTypes,
  artistResponseTypes,
  isArtDirector
} = require('../../../models/Artist');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

/* utilities */

const artistSelectForFindAll = {
  //isFeaturedInLandingPage: 0,
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
    {
      path: 'artDirectors',
      select: {
        label: 1,
        name_tc: 1,
        name_sc: 1,
        name_en: 1
      }
    },
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
            name_en: 1
            //featuredImage: 1
          }
          // populate: [
          //   {
          //     path: 'featuredImage',
          //     select: {
          //       url: 1
          //     }
          //   }
          // ]
        }
      ]
    }
  ]
};

const artistPopulationListForFindAll = [
  {
    path: 'featuredImage',
    select: mediumSelect
  }
];

const artistPopulationListForFindOne = [
  ...artistPopulationListForFindAll,
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
  },
  pageMetaPopulate
];

const getArtistForFrontEndFromDbArtist = (
  dbArtist,
  language,
  isRequireDetail = false,
  defaultPageMeta = {},
  isFromListing = false
) => {
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

  let detailData = {};

  if (isRequireDetail) {
    const relatedEvents = getArraySafe(
      isDirector ? artist.eventsDirected : artist.eventsPerformed
    );

    const eventForFrontEndMapFunc = event => {
      // find the corresponding role of the artist in the event
      let artistRoleInEvent = null;

      if (!isDirector) {
        // Note: somehow using label to compare works, can't use _id to compare...
        const correspondingArtistWithRole = event.artists.find(
          artistWithRole =>
            artistWithRole.artist &&
            artistWithRole.artist.label === artist.label
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

      let firstShowDateRaw = null;
      let firstShowDate = null;
      let firstShowYear = null;
      let firstShowMonth = null;
      let lastShowDateRaw = null;
      let lastShowDate = null;
      // let lastShowYear = null;
      // let lastShowMonth = null;
      if (isNonEmptyArray(event.shows)) {
        const firstShow = event.shows[0];
        firstShowDateRaw = firstShow.date;
        firstShowDate = firstShowDateRaw
          ? formatDateStringForFrontEnd(firstShowDateRaw)
          : null;
        firstShowYear = firstShowDateRaw
          ? firstShowDateRaw.getUTCFullYear()
          : null;
        firstShowMonth = firstShowDateRaw
          ? firstShowDateRaw.getUTCMonth()
          : null;

        const lastShow = event.shows[event.shows.length - 1];
        lastShowDateRaw = lastShow.date;
        lastShowDate = lastShowDateRaw
          ? formatDateStringForFrontEnd(lastShowDateRaw)
          : null;
        // lastShowYear = lastShowDateRaw ? lastShowDateRaw.getUTCFullYear() : null;
        // lastShowMonth = lastShowDateRaw ? lastShowDateRaw.getUTCMonth() : null;
      }

      return {
        id: event._id,
        label: cleanLabelForSendingToFrontEnd(event.label),
        name: getEntityPropByLanguage(event, 'name', language),
        fromDate: firstShowDate,
        // fromDateRaw: firstShowDateRaw,
        // fromYear: firstShowYear,
        // fromMonth: firstShowMonth,
        toDate: lastShowDate,
        // toDateRaw: lastShowDateRaw,
        // toYear: lastShowYear,
        // toMonth: lastShowMonth,
        year: firstShowYear,
        month: firstShowMonth,
        artDirectors: getArraySafe(event.artDirectors).map(artDirector => {
          return {
            id: artDirector._id,
            label: cleanLabelForSendingToFrontEnd(artDirector.label),
            name: getEntityPropByLanguage(artDirector, 'name', language)
          };
        }),
        // artists: getArraySafe(event.artists).map(artistWithRole => {
        //   /**
        //    * !!!Important!!!
        //    * guestArtistRemarks is now used by both guest and non-guest artists
        //    */
        //   const artistRemarks = getEntityPropByLanguage(
        //     artistWithRole,
        //     'guestArtistRemarks',
        //     language
        //   );

        //   if (artistWithRole.isGuestArtist !== true) {
        //     const artist = artistWithRole.artist;
        //     return {
        //       id: artist._id,
        //       label: cleanLabelForSendingToFrontEnd(artist.label),
        //       name: getEntityPropByLanguage(artist, 'name', language),
        //       featuredImage: {
        //         src: artist.featuredImage && artist.featuredImage.url
        //       },
        //       remarks: artistRemarks
        //     };
        //   } else {
        //     return {
        //       id: null,
        //       label: null,
        //       name: getEntityPropByLanguage(
        //         artistWithRole,
        //         'guestArtistName',
        //         language
        //       ),
        //       featuredImage: {
        //         src:
        //           artistWithRole.guestArtistImage &&
        //           artistWithRole.guestArtistImage.url
        //       },
        //       remarks: artistRemarks
        //     };
        //   }
        // }),
        artistRole: artistRoleInEvent,
        fromDate: firstShowDate
        //shows: getArraySafe(event.shows)
      };
    };

    const { sortedEvents /*, closestEvent*/ } = mapAndSortEvents(
      relatedEvents,
      eventForFrontEndMapFunc,
      -1 // descending
    );

    // // set relatedArtists
    // let relatedArtists = [];
    // if (closestEvent) {
    //   relatedArtists = getArraySafe(closestEvent.artists);
    // }

    // set relatedEvents
    const eventsByYear = {};

    sortedEvents.forEach(event => {
      // year field added to event by eventForFrontEndMapFunc()
      const yearStr = event.year.toString();
      if (Array.isArray(eventsByYear[yearStr])) {
        eventsByYear[yearStr].push(event);
      } else {
        eventsByYear[yearStr] = [event];
      }
    });

    const eventsByYearArray = Object.keys(eventsByYear)
      .sort()
      .reverse()
      .map(year => {
        return {
          year: year,
          events: eventsByYear[year]
        };
      });

    detailData = {
      withoutMaskImage: {
        src: artist.withoutMaskImage && artist.withoutMaskImage.url
      },
      gallery: getArraySafe(artist.gallery).map(medium => {
        return {
          src: medium && medium.url
        };
      }),
      sound: artist.sound ? artist.sound.url : null,
      description: getEntityPropByLanguage(artist, 'desc', language),
      questions: getArraySafe(artist.qnas).map(qna => ({
        title: getEntityPropByLanguage(qna, 'question', language),
        answer: getEntityPropByLanguage(qna, 'answer', language)
      })),
      relatedEvents: eventsByYearArray,
      //relatedArtists: relatedArtists,
      pageMeta: getPageMetaForFrontEnd(
        artist.pageMeta,
        language,
        defaultPageMeta
      )
    };
  }
  // if (getEntityPropByLanguage(artist, 'name', language) === "一点鴻") {
  //   console.log(artist.featuredImage);
  // } else {
  //   console.log()
  // }
  console.log(artist.featuredImage);

  return {
    id: artist._id,
    label: cleanLabelForSendingToFrontEnd(artist.label),
    name: getEntityPropByLanguage(artist, 'name', language),
    post: post,
    gender: isDirector ? null : gender,
    directorRemarks: isDirector
      ? getEntityPropByLanguage(artist, 'directorRemarks', language)
      : null,
    featuredImage: {
      // HUNG edited
      // try serve cover image if have
      src: artist.featuredImage && ((isFromListing && artist.featuredImage.thumbUrl)? artist.featuredImage.thumbUrl: artist.featuredImage.url)
      // src: artist.featuredImage && artist.featuredImage.url
    },
    ...detailData
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
      artistPopulationListForFindAll,
      true
    );

    const artistsForFrontEnd = getArraySafe(artists).map(artist => {
      return getArtistForFrontEndFromDbArtist(artist, language, false, {}, true);
    });

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
router.get(
  '/:lang/artists/:label',
  [languageHandling, frontEndDetailPageApiLabelHandling],
  async (req, res) => {
    try {
      const label = req.detailItemLabel;
      const language = req.language;

      const pageMetaMiscellaneous = await getPageMetaMiscellaneousFromDb(
        true,
        res
      );
      if (!pageMetaMiscellaneous) {
        return;
      }

      const defaultPageMeta = getMixedPageMetas(
        pageMetaMiscellaneous.artistListMeta,
        pageMetaMiscellaneous.landingPageMeta
      );

      const artist = await Artist.findOne({
        label: label
      })
        .select(artistSelectForFindOne)
        .populate(artistPopulationListForFindOne);

      if (!artist) {
        return res
          .status(404)
          .json({ errors: [artistResponseTypes.ARTIST_NOT_EXISTS] });
      }

      const artistForFrontEnd = getArtistForFrontEndFromDbArtist(
        artist,
        language,
        true,
        defaultPageMeta
      );

      res.json(artistForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
