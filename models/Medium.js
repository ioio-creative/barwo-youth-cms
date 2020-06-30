const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MediumUsageSchema = mongoose.Schema({
  entityType: {
    type: String
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  }
});

const MediumSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  alernativeText: {
    type: String
  },
  type: {
    type: String,
    require: true
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'mediumTag'
    }
  ],
  url: {
    type: String,
    require: true
  },
  usages: [MediumUsageSchema],
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

MediumSchema.plugin(mongoosePaginate);

module.exports.Medium = mongoose.model('medium', MediumSchema);

const mediumTypes = {
  IMAGE: { type: 'IMAGE', route: 'images' },
  VIDEO: { type: 'VIDEO', route: 'videos' },
  AUDIO: { type: 'AUDIO', route: 'audios' },
  PDF: { type: 'PDF', route: 'pdfs' }
};

module.exports.mediumTypes = mediumTypes;

module.exports.routesOfMediumTypes = Object.keys(mediumTypes).map(
  type => mediumTypes[type].route
);

module.exports.getMediumTypeFromRoute = route => {
  return Object.values(mediumTypes).find(
    mediumType => mediumType.route === route
  );
};

module.exports.mediumUsageEntityTypes = {
  ARTIST: { type: 'ARTIST', collectionName: 'artist' },
  EVENT: { type: 'EVENT', collectionName: 'event' }
};

module.exports.mediumResponseTypes = {
  // MulterError
  TOO_MANY_FILES: 'TOO_MANY_FILES',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  NO_FILE_UPLOADED: 'NO_FILE_UPLOADED',

  // input validation
  NAME_REQUIRED: 'NAME_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  URL_REQUIRED: 'URL_REQUIRED',

  // db check
  MEDIUM_TYPE_NOT_EXISTS: 'MEDIUM_TYPE_NOT_EXISTS',
  MEDIUM_NOT_EXISTS: 'MEDIUM_NOT_EXISTS',
  NAME_ALREADY_EXISTS: 'NAME_ALREADY_EXISTS'
};
