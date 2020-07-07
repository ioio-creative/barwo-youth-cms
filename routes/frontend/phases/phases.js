const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Phase } = require('../../../models/Phase');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');

/* utilities */

const phaseSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const phaseSelectForFindOne = {
  ...phaseSelectForFindAll
};

const phasePopulationListForFindAll = [
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

const phasePopulationListForFindOne = [...phasePopulationListForFindAll];

const getPhaseForFrontEndFromDbPhase = (dbPhase, language) => {
  const phase = dbPhase;

  return {
    id: phase._id,
    label: event.label,
    name: getEntityPropByLanguage(event, 'name', language),
    themeColor: event.themeColor,
    artDirector: getArraySafe(event.artDirectors).map(artDirector => ({
      id: artDirector._id,
      label: artDirector.label,
      name: getEntityPropByLanguage(artDirector, 'name', language)
    })),
    schedule: getArraySafe(event.shows).map(show => ({
      date: {
        from: show.date ? formatDateStringForFrontEnd(show.date) : null,
        to: null
      },
      time: show.startTime
    })),
    info: {
      scenarist: getArraySafe(event.scenarists),
      heading: getEntityPropByLanguage(event, 'descHeadline', language),
      description: getEntityPropByLanguage(event, 'desc', language),
      remark: getEntityPropByLanguage(event, 'remarks', language)
    },
    featuredImages: {
      src: event.featuredImage && event.featuredImage.url
    },
    gallery: getArraySafe(event.gallery).map(medium => {
      return {
        src: medium && medium.src
      };
    }),
    // TODO:
    relatedActors: []
  };
};

/* end of utilities */

// @route   GET api/frontend/phases/:lang/phases
// @desc    Get all phases
// @access  Public
router.get('/:lang/phases', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const phases = await Phase.find({
      isEnabled: true
    })
      .select(phaseSelectForFindAll)
      .populate(phasePopulationListForFindAll)
      .sort({
        derivedLabel: 1
      });

    const phasesForFrontEnd = phases.map(phase => {
      return getPhaseForFrontEndFromDbEvent(phase, language);
    });

    res.json(phasesForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/phases/:lang/phases/:label
// @desc    Get phase by label
// @access  Public
router.get('/:lang/phases/:label', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const phase = await Phase.findOne({
      label: req.params.label
    })
      .select(phaseSelectForFindOne)
      .populate(phasePopulationListForFindOne);

    const phaseForFrontEnd = getPhaseForFrontEndFromDbPhase(phase, language);

    res.json(phaseForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
