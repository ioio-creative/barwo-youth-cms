const mongoose = require('mongoose');

const MiscellaneousInfoSchema = mongoose.Schema({
  /* contact us */
  contactUsOrganizationName_tc: {
    type: String,
    require: true
  },
  contactUsOrganizationName_sc: {
    type: String,
    require: true
  },
  contactUsOrganizationName_en: {
    type: String,
    require: true
  }
  /* end of contact us */
});

module.exports.MiscellaneousInfo = mongoose.model(
  'miscellaneousInfo',
  MiscellaneousInfoSchema
);
