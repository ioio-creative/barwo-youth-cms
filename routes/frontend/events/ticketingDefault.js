const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  TicketingDefault,
  ticketingDefaultResponseTypes
} = require('../../../models/TicketingDefault');

/* utilities */

const ticketingDefaultSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const ticketingDefaultPopulationList = [];

/* end of utilities */

// @route   GET api/frontend/events/ticketingDefault/:lang
// @desc    Get ticketing default
// @access  Public
router.get('/:lang', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const ticketingDefault = await TicketingDefault.findOne({})
      .select(ticketingDefaultSelect)
      .populate(ticketingDefaultPopulationList);
    if (!ticketingDefault) {
      return res.status(404).json({
        errors: [ticketingDefaultResponseTypes.TICKETING_DEFAULT_NOT_EXISTS]
      });
    }

    const ticketingDefaultForFrontEnd = {
      venue: getEntityPropByLanguage(ticketingDefault, 'venue', language),
      prices: getArraySafe(ticketingDefault.prices).map(price =>
        getEntityPropByLanguage(price, 'price', language)
      ),
      priceRemarks: getEntityPropByLanguage(
        ticketingDefault,
        'priceRemarks',
        language
      ),
      phones: getArraySafe(ticketingDefault.phones).map(phone => ({
        label: getEntityPropByLanguage(phone, 'label', language),
        phone: phone.phone
      })),
      ticketUrl: ticketingDefault.ticketUrl
    };

    res.json(ticketingDefaultForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
