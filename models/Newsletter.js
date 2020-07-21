const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsletterSchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
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
  isEnabled: {
    type: Boolean,
    default: true
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

NewsletterSchema.plugin(mongoosePaginate);

module.exports.Newsletter = mongoose.model('newsletter', NewsletterSchema);

module.exports.newsletterResponseTypes = {
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  TITLE_TC_REQUIRED: 'TITLE_TC_REQUIRED',
  TITLE_SC_REQUIRED: 'TITLE_SC_REQUIRED',
  TITLE_EN_REQUIRED: 'TITLE_EN_REQUIRED',
  MESSAGE_TC_REQUIRED: 'MESSAGE_TC_REQUIRED',
  MESSAGE_SC_REQUIRED: 'MESSAGE_SC_REQUIRED',
  MESSAGE_EN_REQUIRED: 'MESSAGE_EN_REQUIRED',

  // db check
  NEWSLETTER_NOT_EXISTS: 'NEWSLETTER_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'EMAIL_ADDRESS_ALREADY_EXISTS'
};
