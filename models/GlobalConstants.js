const mongoose = require('mongoose');

const GlobalConstantsSchema = mongoose.Schema({
  latestShow_tc: {
    type: String
    // unique: true,
    // require: true
  },
  latestShow_sc: {
    type: String
    // unique: true,
    // require: true
  },
  latestShow_en: {
    type: String
    // unique: true,
    // require: true
  },
  scheduleOfShow_tc: {
    type: String
    // require: true
  },
  scheduleOfShow_sc: {
    type: String
    // require: true
  },
  scheduleOfShow_en: {
    type: String
    // require: true
  },
  artDirector_tc: {
    type: String
    // require: true
  },
  artDirector_sc: {
    type: String
    // require: true
  },
  artDirector_en: {
    type: String
    // require: true
  },
  actor_tc: {
    type: String
    // require: true
  },
  actor_sc: {
    type: String
    // require: true
  },
  actor_en: {
    type: String
    // require: true
  },
  detailsOfShow_tc: {
    type: String
    // require: true
  },
  detailsOfShow_sc: {
    type: String
    // require: true
  },
  detailsOfShow_en: {
    type: String
    // require: true
  },
  show_tc: {
    type: String
    // require: true
  },
  show_sc: {
    type: String
    // require: true
  },
  sho_en: {
    type: String
    // require: true
  },
  allShow_tc: {
    type: String
    // require: true
  },
  allShow_sc: {
    type: String
    // require: true
  },
  allShow_en: {
    type: String
    // require: true
  },
  activities_tc: {
    type: String
    // require: true
  },
  activities_sc: {
    type: String
    // require: true
  },
  activities_en: {
    type: String
    // require: true
  },
  downloadPDF_tc: {
    type: String
    // require: true
  },
  downloadPDF_sc: {
    type: String
    // require: true
  },
  downloadPDF_en: {
    type: String
    // require: true
  },
  ourActors_tc: {
    type: String
    // require: true
  },
  ourActors_sc: {
    type: String
    // require: true
  },
  ourActors_en: {
    type: String
    // require: true
  },
  ymtTheater_tc: {
    type: String
    // require: true
  },
  ymtTheater_sc: {
    type: String
    // require: true
  },
  ymtTheater_en: {
    type: String
    // require: true
  },
  followUs_tc: {
    type: String
    // require: true
  },
  followUs_sc: {
    type: String
    // require: true
  },
  followUs_en: {
    type: String
    // require: true
  },
  all_tc: {
    type: String
    // require: true
  },
  all_sc: {
    type: String
    // require: true
  },
  all_en: {
    type: String
    // require: true
  },
  boy_tc: {
    type: String
    // require: true
  },
  boy_sc: {
    type: String
    // require: true
  },
  boy_en: {
    type: String
    // require: true
  },
  girl_tc: {
    type: String
    // require: true
  },
  girl_sc: {
    type: String
    // require: true
  },
  girl_en: {
    type: String
    // require: true
  },
  inherit_tc: {
    type: String
    // require: true
  },
  inherit_sc: {
    type: String
    // require: true
  },
  inherit_en: {
    type: String
    // require: true
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

module.exports.GlobalConstants = mongoose.model(
  'GlobalConstants',
  GlobalConstantsSchema
);

module.exports.globalConstantsPageResponseTypes = {
  // input validation
  LATESTSHOW_TC_REQUIRED: 'LATESTSHOW_TC_REQUIRED',
  LATESTSHOW_SC_REQUIRED: 'LATESTSHOW_SC_REQUIRED',
  LATESTSHOW_EN_REQUIRED: 'LATESTSHOW_EN_REQUIRED',

  SCHEDULEOFSHOW_TC_REQUIRED: 'SCHEDULEOFSHOW_TC_REQUIRED',
  SCHEDULEOFSHOW_SC_REQUIRED: 'SCHEDULEOFSHOW_SC_REQUIRED',
  SCHEDULEOFSHOW_EN_REQUIRED: 'SCHEDULEOFSHOW_EN_REQUIRED',

  ARTDIRECTOR_TC_REQUIRED: 'ARTDIRECTOR_TC_REQUIRED',
  ARTDIRECTOR_SC_REQUIRED: 'ARTDIRECTOR_SC_REQUIRED',
  ARTDIRECTOR_EN_REQUIRED: 'ARTDIRECTOR_EN_REQUIRED',

  ACTOR_TC_REQUIRED: 'ACTOR_TC_REQUIRED',
  ACTOR_SC_REQUIRED: 'ACTOR_SC_REQUIRED',
  ACTOR_EN_REQUIRED: 'ACTOR_EN_REQUIRED',

  DETAILSOFSHOW_TC_REQUIRED: 'DETAILSOFSHOW_TC_REQUIRED',
  DETAILSOFSHOW_SC_REQUIRED: 'DETAILSOFSHOW_SC_REQUIRED',
  DETAILSOFSHOW_EN_REQUIRED: 'DETAILSOFSHOW_EN_REQUIRED',

  SHOW_TC_REQUIRED: 'SHOW_TC_REQUIRED',
  SHOW_SC_REQUIRED: 'SHOW_SC_REQUIRED',
  SHOW_EN_REQUIRED: 'SHOW_EN_REQUIRED',

  ALLSHOW_TC_REQUIRED: 'ALLSHOW_TC_REQUIRED',
  ALLSHOW_SC_REQUIRED: 'ALLSHOW_SC_REQUIRED',
  ALLSHOW_EN_REQUIRED: 'ALLSHOW_EN_REQUIRED',

  ACTIVITIES_TC_REQUIRED: 'ACTIVITIES_TC_REQUIRED',
  ACTIVITIES_SC_REQUIRED: 'ACTIVITIES_SC_REQUIRED',
  ACTIVITIES_EN_REQUIRED: 'ACTIVITIES_EN_REQUIRED',

  DOWNLOADPDF_TC_REQUIRED: 'DOWNLOADPDF_TC_REQUIRED',
  DOWNLOADPDF_SC_REQUIRED: 'DOWNLOADPDF_SC_REQUIRED',
  DOWNLOADPDF_EN_REQUIRED: 'DOWNLOADPDF_EN_REQUIRED',

  YMTTHEATER_TC_REQUIRED: 'YMTTHEATER_TC_REQUIRED',
  YMTTHEATER_SC_REQUIRED: 'YMTTHEATER_SC_REQUIRED',
  YMTTHEATER_EN_REQUIRED: 'YMTTHEATER_EN_REQUIRED',

  FOLLOWUS_TC_REQUIRED: 'FOLLOWUS_TC_REQUIRED',
  FOLLOWUS_SC_REQUIRED: 'FOLLOWUS_SC_REQUIRED',
  FOLLOWUS_EN_REQUIRED: 'FOLLOWUS_EN_REQUIRED',

  ALL_TC_REQUIRED: 'ALL_TC_REQUIRED',
  ALL_SC_REQUIRED: 'ALL_SC_REQUIRED',
  ALL_EN_REQUIRED: 'ALL_EN_REQUIRED',

  BOY_TC_REQUIRED: 'BOY_TC_REQUIRED',
  BOY_SC_REQUIRED: 'BOY_SC_REQUIRED',
  BOY_EN_REQUIRED: 'BOY_EN_REQUIRED',

  GIRL_TC_REQUIRED: 'GIRL_TC_REQUIRED',
  GIRL_SC_REQUIRED: 'GIRL_SC_REQUIRED',
  GIRL_EN_REQUIRED: 'GIRL_EN_REQUIRED',

  INHERIT_TC_REQUIRED: 'INHERIT_TC_REQUIRED',
  INHERIT_SC_REQUIRED: 'INHERIT_SC_REQUIRED',
  INHERIT_EN_REQUIRED: 'INHERIT_EN_REQUIRED',

  // db check
  GLOBAL_CONSTANTS_PAGE_NOT_EXISTS: 'GLOBAL_CONSTANTS_PAGE_NOT_EXISTS'
};
