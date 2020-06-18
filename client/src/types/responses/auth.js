import generalResponseTypes from 'types/responses/general';

export default {
  NOT_AUTHORIZED: {
    type: 'NOT_AUTHORIZED',
    msg: 'NOT_AUTHORIZED'
  },
  INVALID_CREDENTIALS: {
    type: 'INVALID_CREDENTIALS',
    msg: 'INVALID_CREDENTIALS'
  },
  USER_DOES_NOT_HAVE_RIGHT: {
    type: 'USER_DOES_NOT_HAVE_RIGHT',
    msg: 'USER_DOES_NOT_HAVE_RIGHT'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};
