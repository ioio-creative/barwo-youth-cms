const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SendHistorySchema = mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  recipients: {
    type: [String]
  },
  title_tc: {
    type: String,
    required: true
  },
  title_sc: {
    type: String,
    required: true
  },
  title_en: {
    type: String,
    required: true
  },
  message_tc: {
    type: String,
    require: true
  },
  message_sc: {
    type: String,
    require: true
  },
  message_en: {
    type: String,
    require: true
  },
  email: { type: mongoose.Schema.Types.ObjectId, ref: 'newsletter' },
  sendDT: {
    type: Date,
    default: Date.now
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

SendHistorySchema.plugin(mongoosePaginate);

module.exports.SendHistory = mongoose.model('sendHistory', SendHistorySchema);

module.exports.sendHistoryResponseTypes = {
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  TITLE_TC_REQUIRED: 'TITLE_TC_REQUIRED',
  TITLE_SC_REQUIRED: 'TITLE_SC_REQUIRED',
  TITLE_EN_REQUIRED: 'TITLE_EN_REQUIRED',
  MESSAGE_TC_REQUIRED: 'MESSAGE_TC_REQUIRED',
  MESSAGE_SC_REQUIRED: 'MESSAGE_SC_REQUIRED',
  MESSAGE_EN_REQUIRED: 'MESSAGE_EN_REQUIRED',

  // db check
  SENDHISTORY_NOT_EXISTS: 'SENDHISTORY_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'EMAIL_ADDRESS_ALREADY_EXISTS'
};
