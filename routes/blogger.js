const express = require('express')
const router = express.Router();
const blogger = require('../controller/blogger')
const { loginValidation } = require('../helpers/validation');
const auth = require('../middleware/auth')
const {upload} = require('../helpers/image-uploader')


router.post('/login',loginValidation,blogger.login)

router.post('/',auth.check_token,upload.array('image'),blogger.createBlog)

router.get('/',blogger.findBlog)

router.put('/:id',auth.check_token,blogger.updateBlog)
router.delete('/:id',auth.check_token,blogger.deleteBlog)

router.get('/Blogs',auth.check_token,blogger.showAllBlog)

router.get('/comments/:id',auth.check_token,blogger.showComment)

module.exports = router
