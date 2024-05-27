const express = require('express')
const router = express.Router();
const category = require("../controller/categorycontroller")

router.post('/',category.addcategory)

module.exports = router