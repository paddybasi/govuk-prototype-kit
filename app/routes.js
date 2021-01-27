const express = require('express')
const crimeRouter = require('./crime.routes')
const router = express.Router()

// Add your routes here - above the module.exports line
router.use('/crime', crimeRouter)

module.exports = router
