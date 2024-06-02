const express = require('express')
const router = express.Router();
const blogger = require('../controller/blogger')
const { loginValidation } = require('../helpers/validation');
const auth = require('../middleware/auth')

router.post('/login',loginValidation,blogger.login)

module.exports = router
