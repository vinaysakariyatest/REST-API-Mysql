const express = require('express')
const router = express.Router();
const user = require('../controller/usercontroller')
const { signinValidation } = require('../helpers/validation');

router.post('/signin',signinValidation,user.signin)

router.post('/login',user.login)

router.post('/send-mail-verification',user.sendMailVerification)

router.post('/update-password',user.updatePassword)

router.post('/forget-password',user.forget_password)

router.get('/reset-password',user.reset_password)

// router.get('/',user.viewUser)
// router.put('/:id',user.updateUser)
// router.delete('/:id',user.deleteUser)


module.exports = router