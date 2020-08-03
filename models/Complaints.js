const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ComplaintsSchema = mongoose.Schema({
  emailAddresses: {
    type: [String]
  }
});

ComplaintsSchema.plugin(mongoosePaginate);

module.exports.Complaints = mongoose.model('complaints', ComplaintsSchema);

module.exports.complaintsResponseTypes = {
  // db check
  CONTACT_NOT_EXISTS: 'CONTACT_NOT_EXISTS',
  CONTACT_DISABLED: 'CONTACT_DISABLED'
};
