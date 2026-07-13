const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { runNextJob, runBatch } = require('../controllers/worker.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.post('/run', requireAuth, runNextJob);
router.post('/run-all', requireAuth, runBatch);

module.exports = router;
