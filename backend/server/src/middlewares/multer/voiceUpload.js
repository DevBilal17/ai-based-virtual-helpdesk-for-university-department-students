const multer = require('multer');

const uploadVoice = multer({
  dest: 'temp/',
});

module.exports = { uploadVoice };