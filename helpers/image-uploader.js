const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/Images');
    },
    filename: function(req, file, cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name, function(error1, success1){
            if(error1) throw error1
        })
    }
})

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'imageUrl/jpg' || file.mimetype === 'imageUrl/png'){
//         cb(null, true);
//     }else{
//         cb(new Error('Unsupported file type'), false);
//     }
// }

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter
})

module.exports = {
    upload
}

// module.exports.

