const {check} = require('express-validator');

exports.signinValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail().normalizeEmail({gmail_remove_dots: true}),
]
