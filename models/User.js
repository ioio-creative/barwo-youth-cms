const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  name: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
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

UserSchema.plugin(mongoosePaginate);

module.exports.User = mongoose.model('user', UserSchema);

module.exports.userRoles = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR'
};

module.exports.userResponseTypes = {
  // info messages
  //USER_DELETED: 'USER_DELETED',

  // input validation
  NAME_REQUIRED: 'NAME_REQUIRED',
  EMAIL_INVALID: 'EMAIL_INVALID',
  PASSWORD_INVALID: 'PASSWORD_INVALID',
  ROLE_REQUIRED: 'ROLE_REQUIRED',

  // db check
  USER_NOT_EXISTS: 'USER_NOT_EXISTS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  NAME_ALREADY_EXISTS: 'NAME_ALREADY_EXISTS',
  PASSWORD_CHANGE_OLD_PASSWORD_INVALID: 'PASSWORD_CHANGE_OLD_PASSWORD_INVALID'
};
