const { Association } = require('sequelize')
const {Comment, Post} = require('../models')

module.exports.creaetComment = async(req,res) => {
   try {
    const {content, postId} = req.body

    if(!content || !postId) {
        return res.status(400).json({message:"Please Fill the all Fields"})
    }

    const findPostId = await Post.findByPk(postId)

    if(findPostId) {
        const userId = await req.userData.userId
        const Comments = await Comment.create({
        content: req.body.content,
        postId: req.body.postId,
        userId:req.userData.userId
    })
        return res.status(201).json({ message: "Done!" });
    }else{
        return res.status(400).json({ message: "Post Id not Found" });
    }
    
   } catch (error) {
        console.error("Error Comment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
   }
    
 }