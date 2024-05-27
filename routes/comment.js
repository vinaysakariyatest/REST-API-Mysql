const express = require('express')
const router = express.Router();
const cmt = require('../controller/commentcontroller')
const auth = require('../middleware/auth')

router.post('/',auth.check_token,cmt.creaetComment)

module.exports = router
