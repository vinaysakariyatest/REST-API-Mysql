const { blogger } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Login Blogger
module.exports.login = async (req, res) => {
    try {
  
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
      }
  
      const { email, password } = req.body;
  
      const bloggerLogin = await blogger.findOne({ where: { email: email } });
      // const isVerified = await userLogin.is_verified
  
      if (!bloggerLogin) {
        return res.status(400).json({ message: "Invalid credentials" });
  
      } else {
        // const isMatch = await bcrypt.compare(password, userLogin.password);
        
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
  }
  