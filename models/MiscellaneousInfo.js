const mongoose = require('mongoose');

const MiscellaneousInfoSchema = mongoose.Schema({
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
});
