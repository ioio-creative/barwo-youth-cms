const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ContactSchema = mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
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

ContactSchema.plugin(mongoosePaginate);

module.exports.Contact = mongoose.model('contact', ContactSchema);

module.exports.contactTypes = {
  MISS: 'MISS',
  MR: 'MR',
  MRS: 'MRS',
  NOT_SPECIFIED: 'NOT_SPECIFIED'
};

module.exports.contactResponseTypes = {
  EMAIL_ADDRESS_REQUIRED: 'EMAIL_ADDRESS_REQUIRED',
  NAME_REQUIRED: 'NAME_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',

  // db check
  CONTACT_NOT_EXISTS: 'CONTACT_NOT_EXISTS',
  EMAIL_ADDRESS_ALREADY_EXISTS: 'EMAIL_ADDRESS_ALREADY_EXISTS'
};