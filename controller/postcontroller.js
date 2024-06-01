const { upload } = require('../helpers/image-uploader');
const { Post, category} = require('../models')
const jwt = require("jsonwebtoken");
const path = require('path')
const multer = require('multer');
const { where } = require('sequelize');
// const { validationResult } = require('express-validator');

module.exports.createPost = async (req, res) => {
    try {
        const {title, content, categoryId}  = req.body;
        // if(!title || !content || !imageUrl || !categoryId){
        //     return res.status(400).json({ message: "Please Fill the all Fields" });
        // }
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     return res.status(400).json({ errors: errors.array()});
        // }
        const findcat = await category.findByPk(categoryId)

        // console.log(findcat)
        // const imageUrl1 = req.filename
        // console.log(imageUrl1)
        // const filePaths = req.files.map(file => file.path);
        // const filenames = req.files.map(file => path.basename(file.path));
        // const filenames = req.files.map(file => {
        //     const fileInfo = path.parse(file.originalname);
        //     return fileInfo.name + fileInfo.ext;
        // });
        const filenames = req.files.map(file => file.originalname);
        if(findcat){
                const userId = req.userData.userId
                const post = await Post.create({
                title,
                content,
                imageUrl:filenames,
                categoryId:req.body.categoryId,
                userId:req.userData.userId
            })
            return res.status(201).json({ message: "Post Created Successfully"});
        }else{
            return res.status(400).json({ message: "Category Id not Found" });
        }

    } catch (error) {
        console.error("Error creating Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// get All Post
module.exports.viewPost = async (req,res) => {
    try {
        const getPost = await Post.findAll()
        // const getPost = await req.body
        // console.log(getPost)
        // res.cookie('Data','View Data', { expire: 60000 + Date.now() });
        return res.status(200).json({getPost})
    } catch (error) {
        // console.error("Error Getting Post:", error);
        return res.status(500).json({ message: error.message });
    }
}

// Update Post
module.exports.updatePost = async (req,res) =>{
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const postUpdate = await Post.update(
            {...req.body},
            {where : {id}}
        )

        if(postUpdate[0] === 0){
            return res.status(404).json({message:"Post Not Found"})
        }

        return res.status(200)
        .json({message:"Post updated"})

    } catch (error) {
        console.error("Error Updating Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete Post
module.exports.deletePost = async(req,res) => {
    try {
        const {id} = req.params

        if(!id){
            return res
            .status(404)
            .json({message:"Please pass all the required inputs!"})
        }

        const postDelete = await Post.destroy( {where : { id } })

        if(postDelete === 0){
            return res
                .status(404)
                .json({message:"Post not found"})
        }

        return res
            .status(200)
            .json({message:"Post deleted"})
    } catch (error) {
        console.error("Error Delete Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Like Post
module.exports.likePost = async(req, res) => {
    // try {
    //     const postId = req.params.postId
    //     const userId = req.userData.userId

    //     const postExist = await Post.findOne({where:{ id: postId }})

    //     if(!postExist){
    //         return res.status(404).json({message:"Post not found"});
    //     }

    //     // if(!userId){
    //     //     return res.status(404).json({message:"User Id not found"});
    //     // }
    //     if(postExist.likedBy.includes(userId)){
    //         return res.status(400).json({message:"Post already liked"});
    //     }

    //     if(postExist.dislikedBy.includes(userId)){
    //         postExist.dislikedBy.pull(userId)
    //         postExist.dislikeBy -=1;
    //     }

    //     postExist.likedBy.push(userId)
    //     postExist.likes +=1;

    //     const savedLikes = postExist.save();
    //     return res.status(200).json(savedLikes)

    // } catch (error) {
    //     return res.status(500).json({ message: error.message });
    // }

    try {
        const postId = req.params.postId;
        const userId = req.userData.userId;

        const postExist = await Post.findOne({ where: { id: postId } });

        if (!postExist) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure likedBy and dislikedBy arrays are initialized
        if (!Array.isArray(postExist.likedBy)) {
            postExist.likedBy = [];
        }

        if (!Array.isArray(postExist.dislikedBy)) {
            postExist.dislikedBy = [];
        }

        if (postExist.likedBy.includes(userId)) {
            return res.status(400).json({ message: "Post already liked" });
        }

        if (postExist.dislikedBy.includes(userId)) {
            // Remove userId from dislikedBy array
            postExist.dislikedBy = postExist.dislikedBy.filter(user => user !== userId);
            postExist.dislikes -= 1;
        }

        postExist.likedBy.push(userId);
        postExist.likes += 1;

        await postExist.save(); // Save changes to the database
        return res.status(200).json(postExist);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Dislike Post

module.exports.dislikePost = async(req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userData.userId;

        const postExist = await Post.findOne({ where: { id: postId } });

        if (!postExist) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure likedBy and dislikedBy arrays are initialized
        if (!Array.isArray(postExist.likedBy)) {
            postExist.likedBy = [];
        }

        if (!Array.isArray(postExist.dislikedBy)) {
            postExist.dislikedBy = [];
        }

        if (postExist.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: "Post already disliked" });
        }

        if (postExist.likedBy.includes(userId)) {
            // Remove userId from likedBy array
            postExist.likedBy = postExist.likedBy.filter(user => user !== userId);
            postExist.likes -= 1;
        }

        postExist.dislikedBy.push(userId);
        postExist.dislikes += 1;

        await postExist.save(); // Save changes to the database
        return res.status(200).json(postExist);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Download Image
// module.exports.download = async (req, res) => {
//     try {
//         const filePath = path.join(__dirname,`../public/Images/nature-5.jpg`)

//         res.download(filePath, function (err) {
//             if(err) {
//                 console.log(err)
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }