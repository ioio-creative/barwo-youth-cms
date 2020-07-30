const mongoose = require('mongoose');

const SenderSchema = mongoose.Schema({
  emailAddress: {
    type: String,
    require: true
  },
  name_tc: {
    type: String,
    require: true
  },
  name_sc: {
    type: String,
    require: true
  },
  name_en: {
    type: String,
    require: true
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

module.exports.Sender = mongoose.model('Sender', SenderSchema);

module.exports.senderResponseTypes = {
  // input validation
  EMAILADDRESS_INVALID: 'EMAILADDRESS_INVALID',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',

  // db check
  SENDER_NOT_EXISTS: 'SENDER_NOT_EXISTS'
};
