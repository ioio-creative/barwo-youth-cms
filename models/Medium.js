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
  thumbUrl: {
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

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
// https://www.iana.org/assignments/media-types/media-types.xhtml
const mediumTypes = {
  IMAGE: {
    type: 'IMAGE',
    route: 'images',
    allowedMimeTypes: [
      'image/png',
      'image/gif',
      'image/jpeg',
      'image/webp',
      'image/svg+xml'
    ],
    resizableMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
  },
  VIDEO: {
    type: 'VIDEO',
    route: 'videos',
    allowedMimeTypes: ['video/mpeg', 'video/webm', 'video/mp4']
  },
  AUDIO: {
    type: 'AUDIO',
    route: 'audios',
    allowedMimeTypes: ['audio/mpeg', 'audio/ogg', 'audio/wav']
  },
  PDF: { type: 'PDF', route: 'pdfs', allowedMimeTypes: ['application/pdf'] }
};

mediumTypes.ALL = {
  type: 'ALL',
  route: 'alls',
  allowedMimeTypes: mediumTypes.IMAGE.allowedMimeTypes.concat(
    mediumTypes.VIDEO.allowedMimeTypes,
    mediumTypes.AUDIO.allowedMimeTypes,
    mediumTypes.PDF.allowedMimeTypes
  )
};

module.exports.mediumTypes = mediumTypes;

module.exports.mediumTypesArray = Object.values(mediumTypes);

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
  NO_FILE_UPLOADED_OR_OF_WRONG_TYPE: 'NO_FILE_UPLOADED_OR_OF_WRONG_TYPE',

  // input validation
  NAME_REQUIRED: 'NAME_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  WRONG_TYPE: 'WRONG_TYPE',
  URL_REQUIRED: 'URL_REQUIRED',

  // db check
  MEDIUM_TYPE_NOT_EXISTS: 'MEDIUM_TYPE_NOT_EXISTS',
  MEDIUM_NOT_EXISTS: 'MEDIUM_NOT_EXISTS',
  NAME_ALREADY_EXISTS: 'NAME_ALREADY_EXISTS'
};
