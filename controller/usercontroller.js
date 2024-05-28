const { User } = require("../models");
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mailer = require('../helpers/mailer')

//Signin User
module.exports.signin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please Fill the all Fields" });
    }
    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      req.body.password = await bcrypt.hash(password, 10);
      const user = await User.create(req.body);

      const msg = '<p> Hii '+name+' Please <a href="http://localhost:4000/mail-verification?id='+user.id+'">Verify</a> your mail.</p>'

      mailer.sendMail(email, 'Mail verification', msg)

      return res.status(201).json({ message: "User Created Successfully" });
    }
  } catch (error) {
    console.error("Error creating User:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
module.exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please enter your email and password" });
      }

      const userLogin = await User.findOne({ where: { email: email } });

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
            return res.status(200).json({
              message: "Login successfully",
              token: token,
            });
            
          }else{
            return res.status(404).json({ message: "Invalid credentials" });
          }
        });
      }
    } catch (error) {
      console.error("Error creating User:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

// Update Password
module.exports.updatePassword = async (req, res) => {
  try {
      
  } catch (error) {
      console.error("Error creating User:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
}

// get All User
// module.exports.viewUser = async (req,res,next) => {
//     try {
//         const getUser = await User.findAll()
//         return res.status(200).json({getUser})
//     } catch (error) {
//         console.error("Error creating User:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }



// Delete User
// module.exports.deleteUser = async(req,res) => {
//     try {
//         const {id} = req.params

//         if(!id){
//             return res
//             .status(404)
//             .json({message:"Please pass all the required inputs!"})
//         }

//         const user = await User.destroy( {where : { id } })

//         if(user === 0){
//             return res
//                 .status(404)
//                 .json({message:"User not found"})
//         }

//         return res
//             .status(200)
//             .json({message:"User deleted"})
//     } catch (error) {
//         console.error("Error creating User:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }
