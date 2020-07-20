const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { About, aboutResponseTypes } = require('../../../models/About');
const { ApiGatewayManagementApi } = require('aws-sdk');

/* utilities */

const aboutSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const aboutPopulationList = [
  {
    path: 'planGallery',
    select: {
      url: 1
    }
  },
  {
    path: 'theaterImage',
    select: {
      url: 1
    }
  },
  {
    path: 'admins',
    select: {}
  }
];

/* end of utilities */

// @route   GET api/frontend/about/:lang/about
// @desc    Get about
// @access  Public
router.get('/:lang/about', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const about = await About.findOne({})
      .select(aboutSelect)
      .populate(aboutPopulationList);
    if (!about) {
      return res
        .status(404)
        .json({ errors: [aboutResponseTypes.ABOUT_NOT_EXISTS] });
    }

    const aboutForFrontEnd = {
      barwo: {
        description: getEntityPropByLanguage(about, 'barwoDesc', language)
      },
      plan: {
        description: getEntityPropByLanguage(about, 'planDesc', language),
        gallery: getArraySafe(about.planGallery).map(medium => ({
          src: medium && medium.url
        }))
      },
      theater: {
        image: {
          src: about.theaterImage && about.theaterImage.url
        },
        location: {
          name: getEntityPropByLanguage(about, 'theaterLocationName', language),
          description1: getEntityPropByLanguage(
            about,
            'theaterLocationDesc1',
            language
          ),
          description2: getEntityPropByLanguage(
            about,
            'theaterLocationDesc2',
            language
          )
        },
        traffic: getEntityPropByLanguage(about, 'theaterTraffic', language),
        contact: {
          website: about.contactWebsite,
          tel: about.contactTel,
          fax: about.contactFax,
          email: about.contactEmail
        }
      },
      admins: getArraySafe(about.admins)
    };

    res.json(aboutForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
