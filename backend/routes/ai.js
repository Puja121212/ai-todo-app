const express = require('express');
const router = express.Router();
const { generateSubtasks } = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Protected routes
router.use(auth);

// POST /api/ai/generate-subtasks - Generate subtasks using AI
router.post('/generate-subtasks', generateSubtasks);

module.exports = router;
