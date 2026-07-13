const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getActivity } = require('../controllers/activity.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.get('/', requireAuth, getActivity);

module.exports = router;
