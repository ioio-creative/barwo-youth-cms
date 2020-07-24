const mongoose = require('mongoose');

const AboutAdminSchema = mongoose.Schema({
  title_tc: {
    type: String,
    require: true
  },
  title_sc: {
    type: String,
    require: true
  },
  title_en: {
    type: String,
    require: true
  },
  name_tc: {
    type: String,
    require: true
  },
  name_sc: {
    type: String,
    require: true
  },
  name_en: {
    type: String,
    require: true
  }
});

const AboutSchema = mongoose.Schema({
  barwoDesc_tc: {
    type: String,
    require: true
  },
  barwoDesc_sc: {
    type: String,
    require: true
  },
  barwoDesc_en: {
    type: String,
    require: true
  },
  planDesc_tc: {
    type: String,
    require: true
  },
  planDesc_sc: {
    type: String,
    require: true
  },
  planDesc_en: {
    type: String,
    require: true
  },
  planGallery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ],
  theaterImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  theaterLocationName_tc: {
    type: String,
    require: true
  },
  theaterLocationName_sc: {
    type: String,
    require: true
  },
  theaterLocationName_en: {
    type: String,
    require: true
  },
  theaterLocationHref_tc: {
    type: String
  },
  theaterLocationHref_sc: {
    type: String
  },
  theaterLocationHref_en: {
    type: String
  },
  theaterLocationDesc1_tc: {
    type: String
  },
  theaterLocationDesc1_sc: {
    type: String
  },
  theaterLocationDesc1_en: {
    type: String
  },
  theaterLocationDesc2_tc: {
    type: String
  },
  theaterLocationDesc2_sc: {
    type: String
  },
  theaterLocationDesc2_en: {
    type: String
  },
  theaterTraffic_tc: {
    type: String
  },
  theaterTraffic_sc: {
    type: String
  },
  theaterTraffic_en: {
    type: String
  },
  contactWebsite: {
    type: String
  },
  contactTel: {
    type: String
  },
  contactFax: {
    type: String
  },
  contactEmail: {
    type: String
  },
  admins: [AboutAdminSchema],

  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.About = mongoose.model('about', AboutSchema);

module.exports.aboutResponseTypes = {
  BARWO_DESC_TC_REQUIRED: 'BARWO_DESC_TC_REQUIRED',
  BARWO_DESC_SC_REQUIRED: 'BARWO_DESC_SC_REQUIRED',
  BARWO_DESC_EN_REQUIRED: 'BARWO_DESC_EN_REQUIRED',
  PLAN_DESC_TC_REQUIRED: 'PLAN_DESC_TC_REQUIRED',
  PLAN_DESC_SC_REQUIRED: 'PLAN_DESC_SC_REQUIRED',
  PLAN_DESC_EN_REQUIRED: 'PLAN_DESC_EN_REQUIRED',
  THEATER_LOCATION_NAME_TC_REQUIRED: 'THEATER_LOCATION_NAME_TC_REQUIRED',
  THEATER_LOCATION_NAME_SC_REQUIRED: 'THEATER_LOCATION_NAME_SC_REQUIRED',
  THEATER_LOCATION_NAME_EN_REQUIRED: 'THEATER_LOCATION_NAME_EN_REQUIRED',
  ADMIN_TITLE_TC_REQUIRED: 'ADMIN_TITLE_TC_REQUIRED',
  ADMIN_TITLE_SC_REQUIRED: 'ADMIN_TITLE_SC_REQUIRED',
  ADMIN_TITLE_EN_REQUIRED: 'ADMIN_TITLE_EN_REQUIRED',
  ADMIN_NAME_TC_REQUIRED: 'ADMIN_NAME_TC_REQUIRED',
  ADMIN_NAME_SC_REQUIRED: 'ADMIN_NAME_SC_REQUIRED',
  ADMIN_NAME_EN_REQUIRED: 'ADMIN_NAME_EN_REQUIRED',

  // db check
  ABOUT_NOT_EXISTS: 'ABOUT_NOT_EXISTS'
};
