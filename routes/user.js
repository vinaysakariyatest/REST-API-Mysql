
const express = require('express')
const router = express.Router();
const user = require('../controller/usercontroller')

router.post('/',user.addUser)
router.get('/',user.viewUser)

router.put('/:id',user.updateUser)

router.delete('/:id',user.deleteUser)

module.exports = router