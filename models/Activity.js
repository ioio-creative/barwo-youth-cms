const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { PageMetaSchema } = require('./PageMeta');

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
  nameForLongDisplay_tc: {
    type: String,
    require: true
  },
  nameForLongDisplay_sc: {
    type: String,
    require: true
  },
  nameForLongDisplay_en: {
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
  videoLinks: [
    {
      type: String,
      require: true
    }
  ],
  // downloadName_tc: {
  //   type: String
  // },
  // downloadName_sc: {
  //   type: String
  // },
  // downloadName_en: {
  //   type: String
  // },
  // downloadType: {
  //   type: String
  // },
  // downloadUrl_tc: {
  //   type: String
  // },
  // downloadUrl_sc: {
  //   type: String
  // },
  // downloadUrl_en: {
  //   type: String
  // },
  // downloadMedium: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'medium'
  // },
  /* end of media */
  /* indication of relationships */
  isFeaturedInLandingPage: {
    type: Boolean,
    default: false
  },
  /* end of indication of relationships */
  pageMeta: PageMetaSchema,
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

const activityTypes = {
  GUIDED_TALK: 'GUIDED_TALK',
  YOUTH_PROGRAMME: 'YOUTH_PROGRAMME',
  CANTONESE_OPERA_KNOWLEDGE: 'CANTONESE_OPERA_KNOWLEDGE',
  //COLLEGE_SHOW: 'COLLEGE_SHOW',
  COMMUNITY_PERFORMANCE: 'COMMUNITY_PERFORMANCE',
  EXHIBITION: 'EXHIBITION'
};

const activityTypesArray = Object.values(activityTypes);

const activityTypesInOrder = [
  activityTypes.YOUTH_PROGRAMME,
  activityTypes.GUIDED_TALK,
  activityTypes.EXHIBITION,
  activityTypes.CANTONESE_OPERA_KNOWLEDGE,
  activityTypes.COMMUNITY_PERFORMANCE
];

module.exports.activityTypes = activityTypes;

module.exports.activityTypesArray = activityTypesArray;

module.exports.activityTypesInOrder = activityTypesInOrder;

module.exports.defaultActivityType = activityTypesInOrder[0];

module.exports.isValidActivityType = type => {
  return activityTypesArray.includes(type && type.toUpperCase());
};

module.exports.activityResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  NAME_FOR_LONG_DISPLAY_TC_REQUIRED: 'NAME_FOR_LONG_DISPLAY_TC_REQUIRED',
  NAME_FOR_LONG_DISPLAY_SC_REQUIRED: 'NAME_FOR_LONG_DISPLAY_SC_REQUIRED',
  NAME_FOR_LONG_DISPLAY_EN_REQUIRED: 'NAME_FOR_LONG_DISPLAY_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  FROM_DATE_REQUIRED: 'FROM_DATE_REQUIRED',
  VIDEO_LINK_REQUIRED: 'VIDEO_LINK_REQUIRED',

  // db check
  ACTIVITY_NOT_EXISTS: 'ACTIVITY_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  ACTIVITY_FEATURED_IN_LANDING: 'ACTIVITY_FEATURED_IN_LANDING'
};
