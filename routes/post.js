const express = require('express')
const router = express.Router();
const post = require('../controller/postcontroller')
const auth = require('../middleware/auth')

router.post('/',auth.check_token,post.createPost)
router.get('/',auth.check_token,post.viewPost)

router.put('/:id',auth.check_token,post.updatePost)

router.delete('/:id',auth.check_token,post.deletePost)
module.exports = router

