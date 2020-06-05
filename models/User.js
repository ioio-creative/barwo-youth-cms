const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
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
  createDT: {
    type: Date,
    default: Date.now
  },
  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  deleteDT: {
    type: Date
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = mongoose.model('user', UserSchema);
