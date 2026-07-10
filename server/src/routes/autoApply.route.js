const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getPreferences, updatePreferences } = require('../controllers/autoApply.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.get('/', requireAuth, getPreferences);
router.put('/', requireAuth, updatePreferences);

module.exports = router;
