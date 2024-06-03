const {check} = require('express-validator');

exports.signinValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail().normalizeEmail({gmail_remove_dots: true}),
]

exports.postValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('categoryId', 'Category Id is required').not().isEmpty(),
]

exports.loginValidation = [
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
]

exports.addBlogger = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('password', 'Password is required').not().isEmpty(),
]

// exports.createBlog = [
//     check('title', 'Title is required').not().isEmpty(),
//     check('content', 'Content is required').not.isEmpty(),
//     check('password', 'Password is required').not().isEmpty(),
// ]