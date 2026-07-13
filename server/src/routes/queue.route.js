const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { queueJobs, getQueue, removeQueueItem, updateQueueStatus } = require('../controllers/queue.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.post('/', requireAuth, queueJobs);
router.get('/', requireAuth, getQueue);
router.delete('/:id', requireAuth, removeQueueItem);
router.patch('/:id/status', requireAuth, updateQueueStatus);

module.exports = router;