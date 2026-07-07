const express = require('express')

const { requireAuth } = require('../middleware/auth')

const {
  getAllJobs,
  getSingleJob,
  importJobs,
} = require('../controllers/job.controller')

const router = express.Router()

router.get('/', requireAuth, getAllJobs)

router.post('/import', requireAuth, importJobs)

router.get('/import', requireAuth, (_req, res) =>
  res.status(405).json({ success: false, message: 'Use POST to import jobs' })
)

router.get('/:id', requireAuth, getSingleJob)

module.exports = router