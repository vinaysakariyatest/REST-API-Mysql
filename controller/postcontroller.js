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
        res.cookie('Data','View Data', { expire: 60000 + Date.now() });
        return res.status(200).json({getPost})
    } catch (error) {
        console.error("Error Getting Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// module.exports.viewImage = async (req,res) => {
//     try {
//         const url = req.params.path
//         const getPost = await Post.findOne({imageUrl: url})
//         // const getPost = await req.body
//         // console.log(getPost)
//         return res.status(200).json({getPost})
//     } catch (error) {
//         console.error("Error Getting Post:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }

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