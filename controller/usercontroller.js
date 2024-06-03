const { User, Blog, Comment } = require("../models");
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const mailer = require("../helpers/mailer");
const { validationResult } = require('express-validator')
const cookie = require('cookie-parser')

//Signin User
module.exports.signin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // if (!name || !email || !password) {
    //   return res.status(400).json({ message: "Please Fill the all Fields" });
    // }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()});
    }

    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) {
      return res.status(409).json({ message: "Email is already exists" });
    } else {
      req.body.password = await bcrypt.hash(password, 10);
      const user = await User.create(req.body);

      const msg =
        "<p> Hii " +
        name +
        ' Please <a href="http://localhost:4000/mail-verification?id=' +
        user.id +
        '">Verify</a> your mail.</p>';

      mailer.sendMail(email, "Mail verification", msg);

      return res.status(201).json({ message: "Please check your mail box and verify your email" });
    }
  } catch (error) {
    // console.error("Error creating User:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Login User
module.exports.login = async (req, res) => {
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()});
    }

    const { email, password } = req.body;

    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Please enter your email and password" });
    // }

    const userLogin = await User.findOne
    ({ where: { email: email } });
    // const isVerified = await userLogin.is_verified

    if (!userLogin) {
      return res.status(400).json({ message: "Invalid credentials" });

    } else {
      // const isMatch = await bcrypt.compare(password, userLogin.password);
      
      bcrypt.compare(password, userLogin.password, function (error, result) {
        // if(isMatch){
        //     const token = jwt.sign({
        //         email: userLogin.email,
        //         userId: userLogin.id
        //     },
        //     process.env.SECRET_KEY
        // );
        //     return res.status(200).json({
        //         message:"Login successfully",
        //         token: token
        //     })
        // }

        if (result == true) {
          const token = jwt.sign(
            {
              email: userLogin.email,
              userId: userLogin.id,
            },
            process.env.SECRET_KEY
          );
          // res.cookie('token', token, { maxAge: 60000 });
          // res.cookie("jwt", token, {
          //   expires: new Date(Date.now() + 600000),
          //   httpOnly: true
          // })
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

// Logout
/*module.exports.logout = async(req, res) => {
  try {
    res.clearCookie('jwt');
    // await req.userData.save();
    return res.status(202).json({message:"Logged out"})
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}*/

// Update Password
module.exports.updatePassword = async (req, res) => {
  try {
    const { user_id, old_password, newPassword } = req.body;

    if (!user_id || !old_password || !newPassword) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Fetch user data including password based on the user_id from the database
    const data = await User.findOne({ where: { id: user_id } });

    if (data) {
      const old_password1 = data.password;

      // Compare the provided old password with the stored password
      const isMatch = await bcrypt.compare(old_password, old_password1);
      if (isMatch) {
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const [updated] = await User.update(
          { password: hashedNewPassword },
          { where: { id: user_id } }
        );

        if (updated) {
          return res.status(201).json({ message: "Password has been changed" });
        } else {
          return res.status(500).json({ message: "Failed to update password" });
        }
      } else {
        return res.status(400).json({ message: "Old password does not match" });
      }
    } else {
      return res.status(404).json({ message: "User Id not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mail Verification
module.exports.mailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.render("404");
    }
    const userData = await User.findOne({ where: { id: req.query.id } });

    if (userData) {   
      if (userData.is_verified == 1) {
        return res.render("mail-verification", {
          message: "Your mail is already verified",
        });
      }

      await User.update({ is_verified: 1 }, { where: { id: req.query.id } });

      return res.render("mail-verification", {
        message: "Mail has been verified Successfully",
      });
    } else {
      return res.render("mail-verification", { message: "User not Found!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404");
  }
};

// Again mail verification
module.exports.sendMailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const userData = await User.findOne({ where: { email: email } });

    if (!userData) {
      return res.status(400).json({ message: "Email doesn't exists!" });
    }

    if (userData.is_verified == 1) {
      return res.status(409).json({ message: "Mail is already verified!" });
    }

    const msg =
      "<p> Hii " +
      userData.name +
      ' Please <a href="http://localhost:4000/mail-verification?id=' +
      userData.id +
      '">Verify</a> your mail.</p>';

    mailer.sendMail(email, "Mail verification", msg);

    return res
      .status(201)
      .json({ message: "Verification Link sent to your mail, please check!" });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Send Forget Password Link
module.exports.forget_password = async (req,res) => {
  try {
    const email = req.body.email
    const userData = await User.findOne({where:{email:email}})

    if(userData){
      const randomString = randomstring.generate();
      await User.update(
        {token: randomString},
        {where:{email:email}})

        // const msg ="<p> Hii " +userData.name +', Please copy the link and <a href="http://localhost:4000/reset-password?token='+token+'">Verify</a> reset your password.</p>';
        const msg = `
            <p>Hi ${userData.name},</p>
            <p>Please copy the link and <a href="http://localhost:4000/users/reset-password?token=${randomString}">reset your password</a>.</p>
        `;


        mailer.sendMail(email, "For Reset Password", msg);

        return res.status(200).json({message:"Please check your email and reset your Password"})
    }else{
      return res.status(400).json({message: "Invalid Email"});
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

// Reset Password Link
module.exports.reset_password = async (req, res) => {
  try {
      const token = req.query.token;
      const tokenData = await User.findOne({ where: { token: token } });

      if (tokenData) {
        const password = req.body.password;
        const hashedNewPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the token
        await User.update(
          { password: hashedNewPassword, token: '' ,is_verified:1},
          { where: { id: tokenData.id } }
        );

        return res.status(200).json({ message: "Your password has been reset." });  
      } else {
        return res.status(400).json({ message: "This link has expired." });  
      }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

// Likes
// module.exports.addLike = async (req, res) => {
//   try {
//     const userId = req.userData.userId; // Ensure we're accessing the user ID correctly
//     const id = req.params.id

//     if (!id) {
//       return res
//         .status(400)
//         .json({ message: "Please pass all the required inputs!" });
//     }
    
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }

module.exports.addLike = async (req, res) => {
  try {
    const userId = req.userData.userId; // Ensure we're accessing the user ID correctly
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Please pass all the required inputs!" });
    }

    // Find the blog post by its ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Show Comment
module.exports.showComment = async (req, res) => {
  try {
    const userId = req.userData.userId;

    const getComment = await Comment.findOne({ where: { userId: userId } });
    // console.log(getBlog);

    if (!getComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const allComments = await Comment.findAll({ where: { userId: userId } });

    return res.status(200).json({
      allComments,
    });
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

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

module.exports.deleteComment = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const id = req.params.id;

    
    if (!id) {
      return res
        .status(400)
        .json({ message: "Please pass all the required inputs!" });
    }

    const commentDelete = await Comment.destroy({ where: { id: id, userId: userId } });

    if (commentDelete === 0) {
      return res.status(404).json({ message: "You can't Delete this Comment" });
    }

    return res.status(200).json({ message: "Comment Deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

