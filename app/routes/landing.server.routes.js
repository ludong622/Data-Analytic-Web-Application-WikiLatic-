var express = require('express')
var controller = require('../controllers/landing.server.controller')
var router = express.Router()
router.get('/', controller.showLandingPage)
router.post('/',controller.register)
module.exports = router