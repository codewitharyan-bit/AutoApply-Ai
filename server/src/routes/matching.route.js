const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { testMatching } = require('../controllers/matching.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.post('/test', requireAuth, testMatching);

module.exports = router;