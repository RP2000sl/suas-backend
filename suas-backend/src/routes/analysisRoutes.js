const express = require('express');
const router = express.Router();
const multer = require('multer');
const analysisController = require('../controllers/analysisController');

// File upload setup (Memory storage use karanne fast nisa)
const upload = multer({ storage: multer.memoryStorage() });

// Route for analysis
router.post('/analyze', upload.single('projectZip'), analysisController.uploadAndAnalyze);

// Route for history
router.get('/history', analysisController.getHistory);

module.exports = router;