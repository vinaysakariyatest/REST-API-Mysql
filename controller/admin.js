const { blogger, admin, Blog, category } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

// Login Admin
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill the all fields" });
        }

        const adminExist = await admin.findOne({ where: { email: email } });
        const existPassword = adminExist.password;
        // console.log(existPassword)
        if (!adminExist) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        if (adminExist) {
            if (existPassword == password) {
                const token = jwt.sign(
                    {
                        email: adminExist.email,
                        adminId: adminExist.id,
                    },
                    process.env.SECRET_KEY
                );
                return res.status(200).json({
                    message: "Login successfully",
                    token: token,
                });
            } else {
                return res.status(400).json({ message: "Invalid Password" });
            }
        } else {
            return res.status(400).json({ message: "Invalid Email" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Add Blogger
module.exports.addBlogger = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // if (!name || !email || !password) {
        //   return res.status(400).json({ message: "Please fill the all fields" });
        // }
        const bloggerExist = await blogger.findOne({ where: { email: email } });

        if (bloggerExist) {
            return res.status(409).json({ message: "Blogger is already exists" });
        }

        req.body.password = await bcrypt.hash(password, 10);
        const createBlogger = await blogger.create(req.body);

        return res.status(200).json({ message: "Blogger created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Blogger
module.exports.updateBlogger = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const bloggerUpdate = await blogger.update(
            {...req.body},
            {where : {id}}
        )

        if(bloggerUpdate[0] === 0){
            return res.status(404).json({message:"Blogger Not Found"})
        }

        return res.status(200)
        .json({message:"Blogger updated"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// View Bloggrer
module.exports.viewBlogger = async(req, res) => {
    try {
        const getBlogger = await blogger.findAll();

        return res.status(200).json({
            getBlogger
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Delete Blogger
module.exports.deleteBlogger = async(req,res) => {
    try {
        const {id} = req.params

        if(!id){
            return res
            .status(404)
            .json({message:"Please pass all the required inputs!"})
        }

        const Bloggerdelete = await blogger.destroy( {where : { id } })

        if(Bloggerdelete === 0){
            return res
                .status(404)
                .json({message:"Blogger not found"})
        }

        return res
            .status(200)
            .json({message:"Blogger deleted"})
    } catch (error) {
        console.error("Error Delete Post:", error);
        return res.status(500).json({ message: error.message });
    }
}

// Update Blog
module.exports.updateBlog = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const blogUpdate = await Blog.update(
            {...req.body},
            {where: {id: id}},
        );

        if(blogUpdate[0] === 0){
            return res.status(404).json({message:"Blog Not Found"})
        }

        return res.status(200)
        .json({message:"Blog updated"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Delete Blog
module.exports.deleteBlog = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const Blogdelete = await Blog.destroy( {where : { id } })

        if(Blogdelete === 0){
            return res
                .status(404)
                .json({message:"Blog not found"})
        }

        return res
            .status(200)
            .json({message:"Blog deleted"})

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// View Blog
module.exports.viewBlog = async (req, res) => {
    try {
        const getBlog = await Blog.findAll({
            include: [
                {
                    model: category,
                    as: 'categories',
                    attributes: ['name']
                },
                {
                    model: blogger,
                    as: 'Author',
                    attributes: ['name']
                }
            ]
        });

        return res.status(200).json({
            getBlog
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Add Category
module.exports.addcategory = async (req,res)=>{
    try {
        const { name } = req.body

        if(!name){
            return res.status(400).json({message:"Please Fill the all Fields"})
        }

        const addCtegory = await category.create(req.body)
        console.log(addCtegory)
        return res.status(201).json({ message: "Category Added" });

    } catch (error) {
        console.error("Error Category Added:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Update Blogger
module.exports.updateCategory = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const categoryUpdate = await category.update(
            {...req.body},
            {where : {id}}
        )

        if(categoryUpdate[0] === 0){
            return res.status(404).json({message:"Category Not Found"})
        }

        return res.status(200)
        .json({message:"Category updated"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Category
module.exports.deleteCategory = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const Categorydelete = await category.destroy( {where : { id } })

        if(Categorydelete === 0){
            return res
                .status(404)
                .json({message:"Category not found"})
        }

        return res
            .status(200)
            .json({message:"Category deleted"})

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// View Category
module.exports.viewCategory = async(req, res) => {
    try {
        const viewCategory = await category.findAll()

        return res.status(200).json({ 
            viewCategory
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}