const express = require('express')
const router = express.Router();
const user = require('../controller/user')

router.get('/mail-verification',user.mailVerification)

module.exports = router
