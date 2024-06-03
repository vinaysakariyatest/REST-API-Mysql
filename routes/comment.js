const express = require('express')
const router = express.Router();
const cmt = require('../controller/commentcontroller')
const auth = require('../middleware/auth')

router.post('/',auth.check_token,cmt.creaetComment)

router.put('/:id',auth.check_token,cmt.commentEdit)

router.delete('/:id',auth.check_token,cmt.deleteComment)

module.exports = router
