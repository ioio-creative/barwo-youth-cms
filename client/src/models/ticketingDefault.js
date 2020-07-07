import { formatDateTimeString } from 'utils/datetime';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import generalResponseTypes from 'types/responses/general';

function TicketingDefault() {
  /* ticketing */
  this.venue_tc = '';
  this.venue_sc = '';
  this.venue_en = '';
  this.prices = [];
  this.priceRemarks_tc = '';
  this.priceRemarks_sc = '';
  this.priceRemarks_en = '';
  this.phones = [];
  this.ticketUrl = '';
  /* end of ticketing */
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

TicketingDefault.ticketingDefaultResponseTypes = {
  // input validation
  VENUE_TC_REQUIRED: { type: 'VENUE_TC_REQUIRED', msg: 'VENUE_TC_REQUIRED' },
  VENUE_SC_REQUIRED: { type: 'VENUE_SC_REQUIRED', msg: 'VENUE_SC_REQUIRED' },
  VENUE_EN_REQUIRED: { type: 'VENUE_EN_REQUIRED', msg: 'VENUE_EN_REQUIRED' },
  TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_PHONE_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_PHONE_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_PHONE_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED'
  },

  // db check
  TICKETING_DEFAULT_NOT_EXISTS: {
    type: 'TICKETING_DEFAULT_NOT_EXISTS',
    msg: 'TICKETING_DEFAULT_NOT_EXISTS'
  },
  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

TicketingDefault.getTicketingDefaultForDisplay = ticketingDefault => {
  return {
    ...ticketingDefault,
    lastModifyDTDisplay: formatDateTimeString(ticketingDefault.lastModifyDT),
    lastModifyUserDisplay: ticketingDefault.lastModifyUser
      ? ticketingDefault.lastModifyUser.name
      : '',
    pricesDisplay: firstOrDefault(ticketingDefault.prices, { price_tc: '' })
      .price_tc,
    phonesDisplay: firstOrDefault(ticketingDefault.phones, { phone: '' }).phone
  };
};

/* end of statics */

export default TicketingDefault;
