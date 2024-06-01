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

// router.get('/profile',auth.check_token,user.userProfile)

// router.get('/',user.viewUser)
// router.put('/:id',user.updateUser)
// router.delete('/:id',user.deleteUser)


module.exports = router