const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Existing routes...
router.get('/:userId/:videoId', progressController.getProgress);
router.post('/:userId/:videoId', progressController.updateProgress);

// Add a new route for resetting progress
router.delete('/:userId/:videoId', progressController.resetProgress);

module.exports = router;
