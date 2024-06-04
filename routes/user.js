const express = require('express')
const router = express.Router();
const user = require('../controller/user')
const { signinValidation, loginValidation } = require('../helpers/validation');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/signin',signinValidation,user.signin)

router.post('/login',loginValidation,user.login)

// router.get('/logout',auth.check_token,user.logout)

router.post('/send-mail-verification',user.sendMailVerification)

router.post('/update-password',user.updatePassword)

router.post('/forget-password',user.forget_password)

router.get('/reset-password',user.reset_password)

router.put('/likes/:id',auth.check_token,user.addLike)

router.put('/dislikes/:id',auth.check_token,user.addDislike)

router.get('/comments',auth.check_token,user.showComment)

router.get('/allComments/:id',auth.check_token,user.showAllComments)

router.put('/comments/:id',auth.check_token,user.commentEdit)

router.delete('/comments/:id',auth.check_token,user.deleteComment)

router.get('/blog',auth.check_token,user.showAllBlog)


module.exports = router