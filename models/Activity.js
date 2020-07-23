const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ActivitySchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
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
  },
  type: {
    type: String,
    require: true
  },
  fromDate: {
    type: Date,
    require: true
  },
  toDate: {
    type: Date
  },
  location_tc: {
    type: String
  },
  location_sc: {
    type: String
  },
  location_en: {
    type: String
  },
  desc_tc: {
    type: String
  },
  desc_sc: {
    type: String
  },
  desc_en: {
    type: String
  },
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medium' }],
  downloadName_tc: {
    type: String
  },
  downloadName_sc: {
    type: String
  },
  downloadName_en: {
    type: String
  },
  downloadType: {
    type: String
  },
  downloadUrl_tc: {
    type: String
  },
  downloadUrl_sc: {
    type: String
  },
  downloadUrl_en: {
    type: String
  },
  downloadMedium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  /* end of media */
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

ActivitySchema.plugin(mongoosePaginate);

module.exports.Activity = mongoose.model('activity', ActivitySchema);

module.exports.activityTypes = {
  RESEARCH_AND_EDUCATION: 'RESEARCH_AND_EDUCATION',
  CANTONESE_OPERA_KNOWLEDGE: 'CANTONESE_OPERA_KNOWLEDGE',
  TALK_AND_WORKSHOP: 'TALK_AND_WORKSHOP',
  VIDEO_SHOW: 'VIDEO_SHOW',
  SHARING: 'SHARING',
  PAST_ACTIVITY: 'PAST_ACTIVITY'
};

module.exports.activityResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',

  // db check
  ACTIVITY_NOT_EXISTS: 'ACTIVITY_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  ACTIVITY_DELETED: 'ACTIVITY_DELETED'
};
