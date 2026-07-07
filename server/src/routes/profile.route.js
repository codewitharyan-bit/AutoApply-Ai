const express = require('express')

const { requireAuth } = require('../middleware/auth')
const { getProfile , updateProfile } = require('../controllers/profile.controller')

const router = express.Router()

router.get('/', requireAuth, getProfile)
router.patch('/',requireAuth, updateProfile)


module.exports = router