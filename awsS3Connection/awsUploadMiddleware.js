const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../awsS3Connection/awsConfig');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
    }
  })
});

module.exports = upload;
