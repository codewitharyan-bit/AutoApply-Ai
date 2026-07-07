const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { generateHandler, getHandler } = require('../controllers/careerAnalysis.controller');

router.post('/generate', requireAuth, generateHandler);
router.get('/', requireAuth, getHandler);

module.exports = router;
