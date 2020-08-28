const fileUpload = require('express-fileupload');
const config = require('config');

// file upload middleware
// https://www.npmjs.com/package/express-fileupload
// https://github.com/richardgirges/express-fileupload/tree/master/example
module.exports = fileUpload({
  limits: {
    fileSize: config.get('Aws.s3.limits.fileSizeInMBs') * 1024 * 1024
  },
  useTempFiles: true,
  tempFileDir: '/tmp'
});
