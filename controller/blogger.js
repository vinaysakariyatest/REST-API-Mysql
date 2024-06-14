const { Blog, category, blogger, Comment, User } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");

// Login Blogger
module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const bloggerLogin = await blogger.findOne({ where: { email: email } });
    // const isVerified = await userLogin.is_verified

    if (!bloggerLogin) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      // const isMatch = await bcrypt.compare(password, bloggerLogin.password);

      bcrypt.compare(password, bloggerLogin.password, function (error, result) {
        if (result == true) {
          const token = jwt.sign(
            {
              email: bloggerLogin.email,
              bloggerId: bloggerLogin.id,
            },
            process.env.SECRET_KEY
          );
          return res.status(200).json({
            message: "Login successfully",
            token: token,
          });
        } else {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      });
    }
  } catch (error) {
    // console.error("Error creating User:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Create Blog
module.exports.createBlog = async (req, res) => {
  try {
    const { title, content, image, categoryId, bloggerId } = req.body;

    const findcat = await category.findByPk(categoryId);
    const filenames = req.files.map((file) => file.originalname);

    if (!findcat) {
      return res.status(404).json({ message: "Category Id not Found" });
    } else {  
      const bloggerId = req.userData.bloggerId;
      const bloggerData = await blogger.findOne({ where: { id: bloggerId } });
      const Active = bloggerData.isActive;
      // console.log(Active);

      if (Active == false) {
        return res.status(201).json({ message: "Your Account is not Active" });
      }
      const post = await Blog.create({
        title,
        content,
        image: filenames,
        categoryId: req.body.categoryId,
        bloggerId: req.userData.bloggerId,
      });
      return res.status(201).json({ message: "Blog Created Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Find Blog
module.exports.findBlog = async (req, res) => {
  try {
    const bloggerId = req.userData.bloggerId;

    // Find a blog by bloggerId (not using primary key here)
    const getBlog = await Blog.findOne({ where: { bloggerId: bloggerId } });

    // Check if a blog was found for the given bloggerId
    if (!getBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find all blogs by bloggerId
    const allBlogs = await Blog.findAll(
      { where: { bloggerId: bloggerId },
      
      include: [
        {
          model: category,
          as: 'categories',
          attributes: ['name']
        },
      ]
    });

    return res.status(200).json({
      allBlogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Blog
module.exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params; // Get blog post ID from request parameters
    const bloggerId = req.userData.bloggerId; // Get blogger ID from user data

    if (!id) {
      return res
        .status(400)
        .json({ message: "Please pass all the required inputs!" });
    }

    const blogUpdate = await Blog.update(
      { ...req.body }, // Spread the request body to update the blog post
      { where: { id: id, bloggerId: bloggerId } } // Use both blog post ID and blogger ID in the where clause
    );

    if (blogUpdate[0] === 0) {
      return res.status(404).json({ message: "You can't update this Blog" });
    }

    return res.status(200).json({ message: "Blog updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Blog
module.exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // Get blog post ID from request parameters
    const bloggerId = req.userData.bloggerId; // Get blogger ID from user data

    if (!id) {
      return res
        .status(400)
        .json({ message: "Please pass all the required inputs!" });
    }

    const blogDelete = await Blog.destroy({ where: { id: id, bloggerId: bloggerId } }); // Use both blog post ID and blogger ID in the where clause

    if (blogDelete === 0) {
      return res.status(404).json({ message: "You can't Delete this Blog" });
    }

    return res.status(200).json({ message: "Blog Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Show All Blogs
module.exports.showAllBlog = async (req, res) => {
  try {
    const showAll = await Blog.findAll({
      include: [
        {
          model:category,
          as:'categories',
          attributes: ['name']
        },
        {
          model:blogger,
          as:'Author',
          attributes: ['name']
        }
      ]
    })

    return res.status(200).json({ message: showAll})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Show Comment
module.exports.showComment = async (req, res) => {
  try { 
    const bloggerId = req.userData.bloggerId;
    const id = req.params.id;

    const getComment = await Comment.findOne({ where: { blogId: id } });
    // console.log(getBlog);

    if (!getComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const allComment = await Comment.findAll(
      { where: { blogId: id },
      
      include: [
        {
          model: User,
          as: "users",
          attributes: ['name']
        },
      ],
    });

    return res.status(200).json({
      allComment,
    });
  }  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// View All Users 
module.exports.viewUser = async(req, res) => {
  try {
      const getUser = await User.findAll()

      if(!getUser){
          return res.status(404).json({ message: "User not found" });
      }else{
          return res.status(200).json({ 
              Users: getUser
           })
      }
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}

