const express = require('express')
const router = express.Router();
const user = require('../controller/usercontroller')
const { signinValidation, loginValidation } = require('../helpers/validation');
const auth = require('../middleware/auth')

router.post('/signin',signinValidation,user.signin)

router.post('/login',loginValidation,user.login)

// router.get('/logout',auth.check_token,user.logout)

router.post('/send-mail-verification',user.sendMailVerification)

router.post('/update-password',user.updatePassword)

router.post('/forget-password',user.forget_password)

router.get('/reset-password',user.reset_password)

router.put('/likes/:id',auth.check_token,user.addLike)

router.get('/comments',auth.check_token,user.showComment)

router.put('/comments/:id',auth.check_token,user.commentEdit)

router.delete('/comments/:id',auth.check_token,user.deleteComment)


module.exports = router