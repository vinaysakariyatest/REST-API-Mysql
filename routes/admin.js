const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");

const admin = require("../controller/admin")
const auth = require('../middleware/auth')
const { addBlogger } = require('../helpers/validation');

// Blogger
router.post('/login',admin.login)
router.post('/',auth.check_token,addBlogger,admin.addBlogger)
router.put('/:id',auth.check_token,admin.updateBlogger)
router.delete('/:id',auth.check_token,admin.deleteBlogger)
router.get('/',admin.viewBlogger)

// Blog
router.put('/blog/:id',auth.check_token,admin.updateBlog)
router.delete('/blog/:id',auth.check_token,admin.deleteBlog)
router.get('/blog',auth.check_token,admin.viewBlog)

// Category
router.post('/category',auth.check_token,admin.addcategory)
router.put('/category/:id',auth.check_token,admin.updateCategory)
router.delete('/category/:id',auth.check_token,admin.deleteCategory)
router.get('/category',auth.check_token,admin.viewCategory)

module.exports = router