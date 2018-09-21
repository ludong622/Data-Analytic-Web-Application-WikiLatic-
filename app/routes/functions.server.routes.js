var express = require('express')
var controller = require('../controllers/functions.server.controller')
var router = express.Router()
router.post('/', controller.showSample)
router.get('/', controller.showResult)
module.exports = router