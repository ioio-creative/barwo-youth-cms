const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const BouncesSchema = mongoose.Schema({
  emailAddresses: {
    type: [String]
  }
});

BouncesSchema.plugin(mongoosePaginate);

module.exports.Bounces = mongoose.model('bounces', BouncesSchema);

module.exports.bouncesResponseTypes = {
  // db check
  CONTACT_NOT_EXISTS: 'CONTACT_NOT_EXISTS',
  CONTACT_DISABLED: 'CONTACT_DISABLED'
};
