const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  TicketingDefault,
  ticketingDefaultResponseTypes
} = require('../../../models/TicketingDefault');

/* utilities */

const ticketingDefaultSelect = {};

const ticketingDefaultPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const ticketingDefaultValidationChecks = [
  check('venue_tc', ticketingDefaultResponseTypes.VENUE_TC_REQUIRED).notEmpty(),
  check('venue_sc', ticketingDefaultResponseTypes.VENUE_SC_REQUIRED).notEmpty(),
  check('venue_en', ticketingDefaultResponseTypes.VENUE_EN_REQUIRED).notEmpty()
];

const ticketingDefaultPricesValidation = prices => {
  for (const price of getArraySafe(prices)) {
    let errorType = null;

    if (!price.price_tc) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED;
    } else if (!price.price_sc) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED;
    } else if (!price.price_en) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const ticketingDefaultPhonesValidation = phones => {
  for (const phone of getArraySafe(phones)) {
    let errorType = null;

    if (!phone.label_tc) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED;
    } else if (!phone.label_sc) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED;
    } else if (!phone.label_en) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED;
    } else if (!phone.phone) {
      errorType =
        ticketingDefaultResponseTypes.TICKETING_DEFAULT_PHONE_PHONE_REQUIRED;
    }

    if (errorType) {
      return errorType;
    }
  }

  return null;
};

const handleTicketingDefaultRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const ticketingDefaultRelationshipsValidation = (prices, phones, res) => {
  let errorType = null;

  errorType = ticketingDefaultPricesValidation(prices);
  if (errorType) {
    handleTicketingDefaultRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = ticketingDefaultPhonesValidation(phones);
  if (errorType) {
    handleTicketingDefaultRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

/* end of utilities */

// @route   GET api/backend/events/ticketingDefault
// @desc    Get ticketing default
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const ticketingDefault = await TicketingDefault.findOne({})
      .select(ticketingDefaultSelect)
      .populate(ticketingDefaultPopulationList);
    if (!ticketingDefault) {
      return res.status(404).json({
        errors: [ticketingDefaultResponseTypes.TICKETING_DEFAULT_NOT_EXISTS]
      });
    }
    res.json(ticketingDefault);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res.status(404).json({
      errors: [ticketingDefaultResponseTypes.TICKETING_DEFAULT_NOT_EXISTS]
    });
  }
});

// @route   POST api/backend/events/ticketingDefault
// @desc    Add or update ticketing default
// @access  Private
router.post(
  '/',
  [auth, ticketingDefaultValidationChecks, validationHandling],
  async (req, res) => {
    const {
      venue_tc,
      venue_sc,
      venue_en,
      prices,
      priceRemarks_tc,
      priceRemarks_sc,
      priceRemarks_en,
      phones,
      ticketUrl
    } = req.body;

    // customed validations
    let isSuccess = ticketingDefaultRelationshipsValidation(
      prices,
      phones,
      res
    );
    if (!isSuccess) {
      return;
    }

    // Build Ticketing Default object
    // Note:
    // non-required fields do not need null check
    const ticketingDefaultFields = {};
    if (venue_tc) ticketingDefaultFields.venue_tc = venue_tc;
    if (venue_sc) ticketingDefaultFields.venue_sc = venue_sc;
    if (venue_en) ticketingDefaultFields.venue_en = venue_en;

    ticketingDefaultFields.prices = getArraySafe(prices);

    ticketingDefaultFields.priceRemarks_tc = priceRemarks_tc;
    ticketingDefaultFields.priceRemarks_sc = priceRemarks_sc;
    ticketingDefaultFields.priceRemarks_en = priceRemarks_en;

    ticketingDefaultFields.phones = getArraySafe(phones);

    ticketingDefaultFields.ticketUrl = ticketUrl;

    ticketingDefaultFields.lastModifyDT = new Date();
    ticketingDefaultFields.lastModifyUser = req.user._id;

    try {
      const oldTicketingDefault = await TicketingDefault.findOne({});
      let newTicketingDefault = null;

      if (oldTicketingDefault) {
        // update flow
        newTicketingDefault = await TicketingDefault.findOneAndUpdate(
          {},
          { $set: ticketingDefaultFields }
        );
      } else {
        // insert flow
        newTicketingDefault = new TicketingDefault(ticketingDefaultFields);

        await newTicketingDefault.save();
      }

      res.json(newTicketingDefault);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
