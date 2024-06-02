const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");

const admin = require("../controller/admin")
const auth = require('../middleware/auth')
const { addBlogger } = require('../helpers/validation');

router.post('/login',admin.login)
router.post('/',auth.check_token,addBlogger,admin.addBlogger)
router.put('/:id',auth.check_token,admin.updateBlogger)
router.delete('/:id',auth.check_token,admin.deleteBlogger)

module.exports = router