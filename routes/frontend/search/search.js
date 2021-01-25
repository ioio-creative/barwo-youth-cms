const express = require('express');
const router = express.Router();

// const validationHandling = require('../../../middleware/validationHandling');
const languageHandling = require('../../../middleware/languageHandling');

const { frontEndDateFormatForMongoDb } = require('../../../utils/datetime');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const orderBy = require('../../../utils/js/array/orderBy');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const { Event } = require('../../../models/Event');
const { Artist } = require('../../../models/Artist');
const { News } = require('../../../models/News');
const { Activity } = require('../../../models/Activity');
const { NewsMediaItem } = require('../../../models/NewsMediaItem');
//const { Newsletter } = require('../../../models/Newsletter');
const { Medium } = require('../../../models/Medium');

/* utilities */

const collectionNames = {
  Event: 'Event',
  Artist: 'Artist',
  News: 'News',
  Activity: 'Activity',
  NewsMediaItem: 'NewsMediaItem'
  //Newsletter: 'Newsletter'
};

// https://youtu.be/kZ77X67GUfk
const getSearchArray = language => [
  {
    model: Event,
    search: [
      {
        score: 2,
        path: ['label', 'name_tc', 'name_sc', 'name_en']
      },
      {
        score: 1,
        path: ['desc_tc', 'desc_sc', 'desc_en']
      },
      {
        score: 1,
        path: [
          'artDirectors.name_tc',
          'artDirectors.name_sc',
          'artDirectors.name_en'
        ]
      },
      // {
      //   score: 5,
      //   path: [
      //     'artists.role_tc',
      //     'artists.role_sc',
      //     'artists.role_en'
      //   ]
      // },
      {
        score: 1,
        path: ['scenarists.name_tc', 'scenarists.name_sc', 'scenarists.name_en']
      }
    ],
    lookup: 'featuredImage',
    project: {
      collectionName: collectionNames.Event,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $meta: 'searchScore'
      },
      /**
       * https://docs.mongodb.com/manual/reference/operator/aggregation/arrayElemAt/
       * https://stackoverflow.com/questions/19174895/mongodb-query-to-find-property-of-first-element-of-array
       * https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/
       *
       */
      // firstShow: {
      //   $arrayElemAt: ['$shows', 0]
      // }
      /**
       * https://www.tutorialspoint.com/how-to-convert-date-to-timestamp-in-mongodb
       */
      fromTimestamp: {
        $toLong: {
          $arrayElemAt: ['$shows.date', 0]
        }
      },
      fromDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: {
            $arrayElemAt: ['$shows.date', 0]
          }
        }
      },
      toDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: {
            $arrayElemAt: ['$shows.date', -1]
          }
        }
      }
    }
  },
  {
    model: Event,
    search: [],
    unwind: {
      path: '$artists',
      preserveNullAndEmptyArrays: true
    },
    lookup: {
      from: 'artists',
      localField: 'artists.artist',
      foreignField: '_id',
      as: 'artistsDetails'
    },
    match: [
      "artistsDetails.name_tc",
      "artistsDetails.name_sc",
      "artistsDetails.name_en"
    ],
    addFields: {
      // "$meta.searchScore": 5,
      score: 5
    },
    sort: {
      fromTimestamp: -1
    },
    project: {
      collectionName: collectionNames.Event,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $cond: [
          {$not: ["$score"]}, 
          {$meta: 'searchScore'}, 
          "$score"
        ] 
      },
      /**
       * https://docs.mongodb.com/manual/reference/operator/aggregation/arrayElemAt/
       * https://stackoverflow.com/questions/19174895/mongodb-query-to-find-property-of-first-element-of-array
       * https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/
       *
       */
      // firstShow: {
      //   $arrayElemAt: ['$shows', 0]
      // }
      /**
       * https://www.tutorialspoint.com/how-to-convert-date-to-timestamp-in-mongodb
       */
      fromTimestamp: {
        $toLong: {
          $arrayElemAt: ['$shows.date', 0]
        }
      },
      fromDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: {
            $arrayElemAt: ['$shows.date', 0]
          }
        }
      },
      toDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: {
            $arrayElemAt: ['$shows.date', -1]
          }
        }
      }
    }
  },
  {
    model: Artist,
    search: [
      {
        score: 5,
        path: ['label', 'name_tc', 'name_sc', 'name_en']
      },
      {
        score: 1,
        path: ['desc_tc', 'desc_sc', 'desc_en']
      }
    ],
    lookup: 'featuredImage',
    project: {
      collectionName: collectionNames.Artist,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $meta: 'searchScore'
      }
    }
  },
  {
    model: News,
    search: [
      {
        score: 2,
        path: ['label', 'name_tc', 'name_sc', 'name_en']
      },
      {
        score: 1,
        path: ['desc_tc', 'desc_sc', 'desc_en']
      }
    ],
    lookup: 'featuredImage',
    project: {
      collectionName: collectionNames.News,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $meta: 'searchScore'
      },
      fromTimestamp: {
        $toLong: '$fromDate'
      },
      fromDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: '$fromDate'
        }
      }
    }
  },
  {
    model: Activity,
    search: [
      {
        score: 2,
        path: ['label', 'name_tc', 'name_sc', 'name_en']
      },
      {
        score: 1,
        path: ['desc_tc', 'desc_sc', 'desc_en']
      }
    ],
    lookup: 'featuredImage',
    project: {
      collectionName: collectionNames.Activity,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $meta: 'searchScore'
      },
      fromTimestamp: {
        $toLong: '$fromDate'
      },
      fromDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: '$fromDate'
        }
      },
      toDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: '$toDate'
        }
      }
    }
  },
  {
    model: NewsMediaItem,
    search: [
      {
        score: 2,
        path: ['label', 'name_tc', 'name_sc', 'name_en']
      },
      {
        score: 1,
        path: ['desc_tc', 'desc_sc', 'desc_en']
      }
    ],
    lookup: 'thumbnail',
    project: {
      collectionName: collectionNames.NewsMediaItem,
      ['name' + language.entityPropSuffix]: 1,
      ['desc' + language.entityPropSuffix]: 1,
      label: 1,
      image: {
        $ifNull: [
          {
            $arrayElemAt: ['$imageData.url', 0]
          },
          null
        ]
      },
      score: {
        $meta: 'searchScore'
      },
      type: 1,
      fromTimestamp: {
        $toLong: '$fromDate'
      },
      fromDate: {
        $dateToString: {
          format: frontEndDateFormatForMongoDb,
          date: '$fromDate'
        }
      }
    }
  }
  // {
  //   model: Newsletter,
  //   search: [
  //     {
  //       score: 2,
  //       path: ['label', 'title_tc', 'title_sc', 'title_en']
  //     },
  //     {
  //       score: 1,
  //       path: ['message_tc', 'message_sc', 'message_en']
  //     }
  //   ],
  //   lookup: 'featuredImage',
  //   project: {
  //     collectionName: collectionNames.Newsletter,
  //     ['name' + language.entityPropSuffix]:
  //       '$' + 'title' + language.entityPropSuffix,
  //     ['desc' + language.entityPropSuffix]:
  //       '$' + 'message' + language.entityPropSuffix,
  //     label: 1,
  //     image: {
  //       $ifNull: [
  //         {
  //           $arrayElemAt: ['$imageData.url', 0]
  //         },
  //         null
  //       ]
  //     },
  //     score: {
  //       $meta: 'searchScore'
  //     }
  //   }
  // }
];

/* end of utilities */

// @route   POST api/frontend/search
// @desc    Search the "queryStr" in Event, Artist, News, Activity, NewsMediaItem, Newsletter and return result in "language"
// @access  Public // TODO:
router.post('/:lang?', [languageHandling], async (req, res) => {
  const { queryStr } = req.body;
  const language = req.language;

  try {
    const resultsByCollectionPromise = Promise.all(
      getSearchArray(language).map(async data => {
        // const returnFields = {};
        // data.return.forEach(key => (returnFields[key] = 1));
        // returnFields['score'] = {
        //   $meta: 'searchScore'
        // };
        // returnFields['image'] = {
        //   $arrayElemAt: [ "$company_data.uuid", 0 ]
        // }
        //console.log(returnFields);

        // https://www.forwardadvance.com/course/mongo/mongo-aggregation/aggregation-with-match
        // filter out disabled
        
        if (data.search.length) {
          const matchIsEnabledStage = {
            $match: {
              isEnabled: {
                $ne: false
              }
            }
          };

          const searchStage = {
            $search: {
              compound: {
                should: data.search.map(searchItem => {
                  return {
                    search: {
                      query: queryStr,
                      path: searchItem.path,
                      score: {
                        boost: {
                          value: searchItem.score
                        }
                      }
                    }
                  };
                })
              }
            }
          };

          const projectStage = {
            $project: data.project
          };

          const aggregateStageArray = [];
          // $search must be the first stage of any pipeline it appears in. $search cannot be used in
          // https://docs.atlas.mongodb.com/reference/atlas-search/query-syntax/#query-syntax-ref
          // Error if searchStage is not the first stage in the pipeline:
          // MongoError: $_internalSearchBetaMongotRemote is only valid as the first stage in a pipeline.
          aggregateStageArray.push(searchStage);
          aggregateStageArray.push(matchIsEnabledStage);

          // lookup stage
          const lookupStage = {
            $lookup: {
              from: Medium.collection.collectionName,
              localField: data.lookup,
              foreignField: '_id',
              as: 'imageData'
            }
          };
          aggregateStageArray.push(lookupStage);

          aggregateStageArray.push(projectStage);

          return await data.model.aggregate(aggregateStageArray);
        } else if (data.match.length) {
          const matchStage = {
            $match: {
              isEnabled: {
                $ne: false
              },
              $or: data.match.map(matchPath => {
                return {[matchPath]: queryStr}
              })
            }
          };

          const projectStage = {
            $project: data.project
          };

          const aggregateStageArray = [];
          // $search must be the first stage of any pipeline it appears in. $search cannot be used in
          // https://docs.atlas.mongodb.com/reference/atlas-search/query-syntax/#query-syntax-ref
          // Error if searchStage is not the first stage in the pipeline:
          // MongoError: $_internalSearchBetaMongotRemote is only valid as the first stage in a pipeline.
          if (data.unwind) {
            aggregateStageArray.push({
              $unwind: data.unwind
            });
          }
          if (data.lookup) {
            aggregateStageArray.push({
              $lookup: data.lookup
            });
          }
          aggregateStageArray.push(matchStage);
          if (data.addFields) {
            aggregateStageArray.push({
              $addFields: {
                score: data.addFields.score * queryStr.length
              }
            });
          }
          // aggregateStageArray.push(searchStage);
          // aggregateStageArray.push(matchIsEnabledStage);

          // if (data.lookup) {
          //   // lookup stage
          //   const lookupStage = {
          //     $lookup: {
          //       from: Medium.collection.collectionName,
          //       localField: data.lookup,
          //       foreignField: '_id',
          //       as: 'imageData'
          //     }
          //   };
          //   aggregateStageArray.push(lookupStage);
          // }

          aggregateStageArray.push(projectStage);

          
          if (data.sort) {
            aggregateStageArray.push({
              $sort: data.sort
            });
          }
          return await data.model.aggregate(aggregateStageArray);

        }
      })
    );

    const resultsByCollection = await resultsByCollectionPromise;

    // flatten resultsByCollection into results
    let results = [];
    for (const collection of resultsByCollection) {
      results = results.concat(collection);
    }

    // clean up some fields for each result obj -> resultsCleaned
    const resultsCleaned = results.map(result => {
      Object.keys(result).forEach(key => {
        if (key.endsWith(language.entityPropSuffix)) {
          result[key.replace(language.entityPropSuffix, '')] = result[key];
          delete result[key];
        }

        if (key === 'label') {
          result[key] = cleanLabelForSendingToFrontEnd(result[key]);
        }
      });
      return result;
    });

    // order resultsSpecificToLang by score desc -> resultsSortedByScore
    const resultsSortedByScore = orderBy(resultsCleaned, 'score', 'desc');

    // group related results of the same type
    // list them adjacent to each other
    // e.g. "帝女花"
    let groupedResultsSortedByScore = [];
    const groupedResultIdentifiers = new Set();
    for (const result of resultsSortedByScore) {
      const groupedResultIdentifier = result.name + '_' + result.collectionName;
      const relatedResultCheck = x =>
        x.name === result.name && x.collectionName === result.collectionName;

      // if no related results have been added to groupedResultsSortedByScore yet
      if (!groupedResultIdentifiers.has(groupedResultIdentifier)) {
        groupedResultIdentifiers.add(groupedResultIdentifier);

        const relatedResults = resultsSortedByScore.filter(relatedResultCheck);

        /**
         * !!!Important!!!
         * sorting by fromTimestamp (long) correctly but
         * sorting by fromTime (string) does not coz fromTime is a formatted string,
         * e.g. DD-MM-YYYY, so DD may come first compared to YYYY in fromTime
         */
        groupedResultsSortedByScore = groupedResultsSortedByScore.concat(
          // orderBy(relatedResults, 'fromDate', 'desc')
          orderBy(relatedResults, 'fromTimestamp', 'desc')
        );
      }
    }

    res.json(groupedResultsSortedByScore);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;

// aggregate example, added highlight example
// await Artist.aggregate([
//   {
//     '$search': {
//       'compound': {
//         'should': [
//           {
//             'search': {
//               'query': '活命金牌',
//               'path': [
//                 'name_tc', 'name_sc', 'name_en'
//               ],
//               'score': {
//                 'boost': {
//                   'value': 3
//                 }
//               }
//             }
//           }, {
//             'search': {
//               'query': '西宮',
//               'path': [
//                 'desc_tc', 'desc_sc', 'desc_en'
//               ],
//               'score': {
//                 'boost': {
//                   'value': 2
//                 }
//               }
//             }
//           }, {
//             'search': {
//               'query': '桃花湖畔鳳求凰',
//               'path': [
//                 'writer_tc', 'writer_sc', 'writer_en'
//               ],
//               'score': {
//                 'boost': {
//                   'value': 1
//                 }
//               }
//             }
//           }
//         ]
//       },
//       'highlight': {
//         'path': [
//           'desc_tc', 'desc_sc', 'desc_en'
//         ]
//       }
//     }
//   }, {
//     '$lookup': {
//       'from': 'media',
//       'localField': 'featuredImage',
//       'foreignField': '_id',
//       'as': 'imageData'
//     }
//   }, {
//     '$project': {
//       'name_en': 1,
//       'desc_en': 1,
//       'label': 1,
//       'image': {
//         '$ifNull': [
//           {
//             '$arrayElemAt': [
//               '$imageData.url', 0
//             ]
//           }, null
//         ]
//       },
//       'score': {
//         '$meta': 'searchScore'
//       },
//       'highlights': {
//         '$meta': 'searchHighlights'
//       }
//     }
//   }
// ]);
