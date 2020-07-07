const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TicketingDefaultPriceSchema = mongoose.Schema({
  price_tc: {
    type: String,
    require: true
  },
  price_sc: {
    type: String,
    require: true
  },
  price_en: {
    type: String,
    require: true
  }
});

const TicketingDefaultPhoneSchema = mongoose.Schema({
  label_tc: {
    type: String,
    require: true
  },
  label_sc: {
    type: String,
    require: true
  },
  label_en: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  }
});

const TicketingDefaultSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
  },
  /* ticketing */
  venue_tc: {
    type: String,
    require: true
  },
  venue_sc: {
    type: String,
    require: true
  },
  venue_en: {
    type: String,
    require: true
  },
  prices: [TicketingDefaultPriceSchema],
  priceRemarks_tc: {
    type: String
  },
  priceRemarks_sc: {
    type: String
  },
  priceRemarks_en: {
    type: String
  },
  phones: [TicketingDefaultPhoneSchema],
  ticketUrl: {
    type: String
  },
  /* end of ticketing */
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  createDT: {
    type: Date,
    default: Date.now
  },
  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

TicketingDefaultSchema.plugin(mongoosePaginate);

module.exports.TicketingDefault = mongoose.model(
  'ticketingDefault',
  TicketingDefaultSchema
);

module.exports.ticketingDefaultResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  VENUE_TC_REQUIRED: 'VENUE_TC_REQUIRED',
  VENUE_SC_REQUIRED: 'VENUE_SC_REQUIRED',
  VENUE_EN_REQUIRED: 'VENUE_EN_REQUIRED',
  TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED:
    'TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED',
  TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED:
    'TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED',
  TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED:
    'TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED',
  TICKETING_DEFAULT_PHONE_PHONE_REQUIRED:
    'TICKETING_DEFAULT_PHONE_PHONE_REQUIRED',
  TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED:
    'TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED',
  TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED:
    'TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED',
  TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED:
    'TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED',

  // db check
  TICKETING_DEFAULT_NOT_EXISTS: 'TICKETING_DEFAULT_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
