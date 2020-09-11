const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ContactSchema = mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
    // required: true
  },
  // type: {
  //   type: String,
  //   required: true
  // },
  groups: {
    type: [String]
  },
  language: {
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

// module.exports.contactTypes = {
//   MISS: 'MISS',
//   MR: 'MR',
//   MRS: 'MRS',
//   NOT_SPECIFIED: 'NOT_SPECIFIED'
// };

const contactLanguages = {
  TC: 'TC',
  SC: 'SC',
  EN: 'EN'
};

const contactGroups = {
  MEDIA: 'MEDIA',
  EDM: 'EDM',
  YMT: 'YMT',
  BARWO: 'BARWO',
  PRIMANY: 'PRIMANY',
  SECONDARY: 'SECONDARY',
  UNIVERSITY: 'UNIVERSITY',
  FAMILY: 'FAMILY'
};

module.exports.contactLanguages = contactLanguages;
module.exports.contactGroups = contactGroups;

module.exports.contactResponseTypes = {
  EMAIL_ADDRESS_INVALID: 'EMAIL_ADDRESS_INVALID',
  // NAME_REQUIRED: 'NAME_REQUIRED',
  // TYPE_REQUIRED: 'TYPE_REQUIRED',
  LANGUAGE_REQUIRED: 'LANGUAGE_REQUIRED',

  NO_FILE_UPLOADED_OR_FILE_INVALID_FOR_IMPORT:
    'NO_FILE_UPLOADED_OR_FILE_INVALID_FOR_IMPORT',

  // db check
  CONTACT_NOT_EXISTS: 'CONTACT_NOT_EXISTS',
  EMAIL_ADDRESS_ALREADY_EXISTS: 'EMAIL_ADDRESS_ALREADY_EXISTS'
};
