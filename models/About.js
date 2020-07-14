const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AboutSchema = mongoose.Schema({
  barwo_tc: {
    type: String,
    required: true
  },
  barwo_sc: {
    type: String,
    require: true
  },
  barwo_en: {
    type: String,
    require: true
  },
  plan_tc: {
    type: String,
    required: true
  },
  plan_sc: {
    type: String,
    require: true
  },
  plan_en: {
    type: String,
    require: true
  },
  plan_gallery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ],
  theaterLocation_tc: {
    type: String,
    required: true
  },
  theaterLocation_sc: {
    type: String,
    require: true
  },
  theaterLocation_en: {
    type: String,
    require: true
  },
  theaterDesc1_tc: {
    type: String,
    required: true
  },
  theaterDesc1_sc: {
    type: String,
    require: true
  },
  theaterDesc1_en: {
    type: String,
    require: true
  },
  theaterDesc2_tc: {
    type: String,
    required: true
  },
  theaterDesc2_sc: {
    type: String,
    require: true
  },
  theaterDesc2_en: {
    type: String,
    require: true
  },
  theaterTraffic_tc: {
    type: String,
    required: true
  },
  theaterTraffic_sc: {
    type: String,
    require: true
  },
  theaterTraffic_en: {
    type: String,
    require: true
  },
  contactWebsite: {
    type: String,
    require: true
  },
  contactTel: {
    type: String,
    require: true
  },
  contactFax: {
    type: String,
    require: true
  },
  contactEmail: {
    type: String,
    require: true
  },
  theaterImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  adminTitle_tc: {
    type: String,
    require: true
  },
  adminName_tc: { type: String, require: true },
  adminTitle_sc: {
    type: String,
    require: true
  },
  adminName_sc: { type: String, require: true },
  adminTitle_en: {
    type: String,
    require: true
  },
  adminName_en: { type: String, require: true },

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

AboutSchema.plugin(mongoosePaginate);

module.exports.About = mongoose.model('about', AboutSchema);

module.exports.aboutResponseTypes = {
  BARWO_TC_REQUIRED: 'BARWO_TC_REQUIRED',
  BARWO_SC_REQUIRED: 'BARWO_SC_REQUIRED',
  BARWO_EN_REQUIRED: 'BARWO_EN_REQUIRED',
  PLAN_TC_REQUIRED: 'PLAN_TC_REQUIRED',
  PLAN_SC_REQUIRED: 'PLAN_SC_REQUIRED',
  PLAN_EN_REQUIRED: 'PLAN_EN_REQUIRED',
  THEATER_LOCATION_TC_REQUIRED: 'THEATER_LOCATION_TC_REQUIRED',
  THEATER_LOCATION_SC_REQUIRED: 'THEATER_LOCATION_SC_REQUIRED',
  THEATER_LOCATION_EN_REQUIRED: 'THEATER_LOCATION_EN_REQUIRED',
  THEATER_TRAFFIC_TC_REQUIRED: 'THEATER_TRAFFIC_TC_REQUIRED',
  THEATER_TRAFFIC_SC_REQUIRED: 'THEATER_TRAFFIC_SC_REQUIRED',
  THEATER_TRAFFIC_EN_REQUIRED: 'THEATER_TRAFFIC_EN_REQUIRED',
  THEATER_DESC1_TC_REQUIRED: 'THEATER_DESC1_TC_REQUIRED',
  THEATER_DESC1_SC_REQUIRED: 'THEATER_DESC1_SC_REQUIRED',
  THEATER_DESC1_EN_REQUIRED: 'THEATER_DESC1_EN_REQUIRED',
  THEATER_DESC2_TC_REQUIRED: 'THEATER_DESC2_TC_REQUIRED',
  THEATER_DESC2_SC_REQUIRED: 'THEATER_DESC2_SC_REQUIRED',
  THEATER_DESC2_EN_REQUIRED: 'THEATER_DESC2_EN_REQUIRED',
  CONTACT_WEBSITE_REQUIRED: 'CONTACT_WEBSITE_REQUIRED',
  CONTACT_TEL_REQUIRED: 'CONTACT_TEL_REQUIRED',
  CONTACT_FAX_REQUIRED: 'CONTACT_FAX_REQUIRED',
  CONTACT_EMAIL_REQUIRED: 'CONTACT_EMAIL_REQUIRED',
  ADMIN_TITLE_TC_REQUIRED: 'ADMIN_TITLE_TC_REQUIRED',
  ADMIN_NAME_TC_REQUIRED: 'ADMIN_NAME_TC_REQUIRED',
  ADMIN_TITLE_SC_REQUIRED: 'ADMIN_TITLE_SC_REQUIRED',
  ADMIN_NAME_SC_REQUIRED: 'ADMIN_NAME_SC_REQUIRED',
  ADMIN_TITLE_EN_REQUIRED: 'ADMIN_TITLE_EN_REQUIRED',
  ADMIN_NAME_EN_REQUIRED: 'ADMIN_NAME_EN_REQUIRED',

  // db check
  ABOUT_PAGE_NOT_EXISTS: 'ABOUT_PAGE_NOT_EXISTS'
};
