const { Association } = require("sequelize");
const { Comment, Blog } = require("../models");

module.exports.creaetComment = async (req, res) => {
    try {
      const userId = req.userData.userId; // Ensure we're accessing the user ID correctly

      const { content, blogId } = req.body;

      if (!content || !blogId) {
        return res.status(400).json({ message: "Please Fill in all Fields" });
      }

      const findBlogId = await Blog.findByPk(blogId);

      if (!findBlogId) {
        return res.status(400).json({ message: "Blog ID not Found" });
      }

      const blogIdExist = await Comment.findOne({where:{blogId: findBlogId}})
      console.log(blogIdExist)

      const comment = await Comment.create({
        content: content,
        blogId: blogId,
        userId: userId,
      });

      return res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Edit Comment
module.exports.commentEdit = async (req, res) => {
  try {
    const { id } = req.params; // Get blog post ID from request parameters
    const userId = req.userData.userId; // Get blogger ID from user data

    if (!id) {
      return res
        .status(400)
        .json({ message: "Please pass all the required inputs!" });
    }

    const updateComment = await Comment.update(
      { ...req.body }, 
      { where: { id: id, userId: userId } } 
    );

    if (updateComment[0] === 0) {
      return res.status(404).json({ message: "You can't update this Comment" });
    }

    return res.status(200).json({ message: "Comment updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Comment
module.exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // Get blog post ID from request parameters
    const userId = req.userData.userId; // Get blogger ID from user data

    if (!id) {
      return res
        .status(400)
        .json({ message: "Please pass all the required inputs!" });
    }

    const commentDelete = await Comment.destroy({ where: { id: id, userId: userId } }); // Use both blog post ID and blogger ID in the where clause

    if (commentDelete === 0) {
      return res.status(404).json({ message: "You can't Delete this Comment" });
    }

    return res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
