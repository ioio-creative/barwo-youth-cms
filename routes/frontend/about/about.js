const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { About, aboutResponseTypes } = require('../../../models/About');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const aboutSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const aboutPopulationList = [
  {
    path: 'planGallery',
    select: mediumSelect
  },
  {
    path: 'theaterImage',
    select: mediumSelect
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

    const mapStaffPersonFunc = staffPerson => ({
      title: getEntityPropByLanguage(staffPerson, 'title', language),
      name: getEntityPropByLanguage(staffPerson, 'name', language).replace(
        /\n/g,
        '<br>'
      )
    });

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
          href: getEntityPropByLanguage(about, 'theaterLocationHref', language),
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
        traffic: getEntityPropByLanguage(about, 'theaterTraffic', language)
        // contact: {
        //   website: about.contactWebsite,
        //   tel: about.contactTel,
        //   fax: about.contactFax,
        //   email: about.contactEmail
        // }
      },
      admins: getArraySafe(about.admins).map(mapStaffPersonFunc),
      productionPersons: getArraySafe(about.productionPersons).map(
        mapStaffPersonFunc
      )
    };

    res.json(aboutForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
