const { blogger, admin } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

