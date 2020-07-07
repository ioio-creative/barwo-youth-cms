const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
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
router.post('/', [auth], async (req, res) => {
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
    /* end of ticketing */
  } = req.body;
  console.log(req.body);

  // Build Ticketing Default object
  // Note:
  // non-required fields do not need null check
  const ticketingDefaultFields = {};
  ticketingDefaultFields.venue_tc = venue_tc;
  ticketingDefaultFields.venue_sc = venue_sc;
  ticketingDefaultFields.venue_en = venue_en;

  ticketingDefaultFields.prices = prices;

  ticketingDefaultFields.priceRemarks_tc = priceRemarks_tc;
  ticketingDefaultFields.priceRemarks_sc = priceRemarks_sc;
  ticketingDefaultFields.priceRemarks_en = priceRemarks_en;

  ticketingDefaultFields.phones = phones;

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
});

module.exports = router;
