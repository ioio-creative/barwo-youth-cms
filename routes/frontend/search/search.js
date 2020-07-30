const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// const validationHandling = require('../../../middleware/validationHandling');
const languageHandling = require('../../../middleware/languageHandling');

const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Event } = require('../../../models/Event');
const { Artist } = require('../../../models/Artist');
const { News } = require('../../../models/News');
const { Activity } = require('../../../models/Activity');
const { Medium } = require('../../../models/Medium');

// @route   POST api/frontend/search
// @desc    Search the "queryStr" in Event, Artist, News, Activity and return result in "language"
// @access  Public // TODO:
router.post('/:lang?', [languageHandling], async (req, res) => {
  const { queryStr } = req.body;
  const language = req.language;

  try {
    const searchArray = [
      {
        model: Event,
        search: [
          {
            score: 3,
            path: ['name_tc', 'name_sc', 'name_en']
          },
          {
            score: 2,
            path: ['desc_tc', 'desc_sc', 'desc_en']
          },
          {
            score: 1,
            path: ['writer_tc', 'writer_sc', 'writer_en']
          }
        ],
        lookup: "featuredImage",
        project: {
          ['name' + language.entityPropSuffix]: 1,
          ['desc' + language.entityPropSuffix]: 1,
          'label': 1,
          'image': {
            $ifNull: [
              {
                "$arrayElemAt": [
                  "$imageData.url",
                  0
                ]
              },
              null
            ]
          },
          'score': {
            $meta: 'searchScore'
          }
        }
      },
      {
        model: Artist,
        search: [
          {
            score: 2,
            path: ['name_tc', 'name_sc', 'name_en']
          },
          {
            score: 1,
            path: ['desc_tc', 'desc_sc', 'desc_en']
          }
        ],
        lookup: "featuredImage",
        project: {
          ['name' + language.entityPropSuffix]: 1,
          ['desc' + language.entityPropSuffix]: 1,
          'label': 1,
          'image': {
            $ifNull: [
              {
                "$arrayElemAt": [
                  "$imageData.url",
                  0
                ]
              },
              null
            ]
          },
          'score': {
            $meta: 'searchScore'
          }
        }
      },
      {
        model: News,
        search: [
          {
            score: 2,
            path: ['name_tc', 'name_sc', 'name_en']
          },
          {
            score: 1,
            path: ['desc_tc', 'desc_sc', 'desc_en']
          }
        ],
        lookup: "featuredImage",
        project: {
          ['name' + language.entityPropSuffix]: 1,
          ['desc' + language.entityPropSuffix]: 1,
          'label': 1,
          'image': {
            $ifNull: [
              {
                "$arrayElemAt": [
                  "$imageData.url",
                  0
                ]
              },
              null
            ]
          },
          'score': {
            $meta: 'searchScore'
          }
        }
      },
      {
        model: Activity,
        search: [
          {
            score: 2,
            path: ['name_tc', 'name_sc', 'name_en']
          },
          {
            score: 1,
            path: ['desc_tc', 'desc_sc', 'desc_en']
          }
        ],
        lookup: "featuredImage",
        project: {
          ['name' + language.entityPropSuffix]: 1,
          ['desc' + language.entityPropSuffix]: 1,
          'label': 1,
          'image': {
            $ifNull: [
              {
                "$arrayElemAt": [
                  "$imageData.url",
                  0
                ]
              },
              null
            ]
          },
          'score': {
            $meta: 'searchScore'
          }
        }
      }
    ];
    const result = Promise.all(
      searchArray.map(async data => {
        // const returnFields = {};
        // data.return.forEach(key => (returnFields[key] = 1));
        // returnFields['score'] = {
        //   $meta: 'searchScore'
        // };
        // returnFields['image'] = {
        //   $arrayElemAt: [ "$company_data.uuid", 0 ]
        // }
        //console.log(returnFields);
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
        aggregateStageArray.push(searchStage);
        if (data.lookup) {
          // lookup stage
          const lookupStage = {
            $lookup: {
              from: Medium.collection.collectionName,
              localField: data.lookup,
              foreignField: "_id",
              as: "imageData"
            }
          }
          aggregateStageArray.push(lookupStage);
        }
        aggregateStageArray.push(projectStage);
        return await data.model.aggregate(aggregateStageArray);
      })
    );

    const dataArray = await result;

    const resultCollectionName = ['Event', 'Artist', 'News', 'Activity'];
    const resultArray = {};
    dataArray.forEach((data, idx) => {
      resultArray[resultCollectionName[idx]] = data.map(dat => {
        Object.keys(dat).forEach(key => {
          if (key.endsWith(language.entityPropSuffix)) {
            dat[key.replace(language.entityPropSuffix, '')] = dat[key];
            delete dat[key];
          }
        });
        return dat;
      });
    });

    res.json(resultArray);
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
