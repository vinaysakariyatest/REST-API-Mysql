const { Post} = require('../models')
const jwt = require("jsonwebtoken");

module.exports.createPost = async (req, res) => {
    try {
        const {title, content, imageUrl, categoryId}  = req.body
        if(!title || !content || !imageUrl || !categoryId){
            return res.status(400).json({ message: "Please Fill the all Fields" });
        }

        const userId = req.userData.userId
        const post = await Post.create({
            title:req.body.title,
            content:req.body.content,
            imageUrl:req.body.imageUrl,
            categoryId:req.body.categoryId,
            userId:req.userData.userId
        })

        return res.status(201).json({ message: "Post Created Successfully" });
    } catch (error) {
        console.error("Error creating Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// get All Post
module.exports.viewPost = async (req,res) => {
    try {
        const getPost = await Post.findAll()
        return res.status(200).json({getPost})
    } catch (error) {
        console.error("Error Getting Post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
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