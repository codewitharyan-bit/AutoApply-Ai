
const express = require('express')
const { clerkWebhook } = require('../controllers/webhook.controller')

const router = express.Router()

router.route('/clerk').post(clerkWebhook)

module.exports = router