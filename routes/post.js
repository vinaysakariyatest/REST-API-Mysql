const express = require('express');
const router = express.Router();
const post = require('../controller/postcontroller');
const auth = require('../middleware/auth');
const multer= require('multer');
const path = require('path');

const {upload} = require('../helpers/image-uploader')

// const storage = multer.diskStorage({
//     destination:function(req, file, cb){
//         cb(null,path.join(__dirname,'../public/Images'),function(error, success){
//             if(error) throw error;
//         })
//     },
//     filename:function(req, file, cb){
//         const name = Date.now()+ '-' +file.originalname
//         cb(null, name, function(error1, success1){
//             if(error1) throw error1
//         })
//     }
// })


// const upload = multer({storage:storage})

router.post('/',auth.check_token,upload.single('imageUrl'),post.createPost)
router.get('/',post.viewPost)

// router.get('/:url',post.viewImage)

router.put('/:id',auth.check_token,post.updatePost)

router.delete('/:id',auth.check_token,post.deletePost)
module.exports = router

