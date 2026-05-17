const express = require('express');
const router = express.Router();

const { processVoice, processTextQuery } = require('../controllers/voice.controller');
const { uploadVoice } = require('../middlewares/multer/voiceUpload');
const protect = require('../middlewares/protect.middleware');



// Route: POST /api/voice/process
router.post('/process', uploadVoice.single('audio'),protect, processVoice);

router.post('/query/process',protect, processTextQuery);

module.exports = router;