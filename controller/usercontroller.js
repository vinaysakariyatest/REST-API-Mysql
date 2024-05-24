const { User } = require('../models')
const sequelize = require('sequelize')

// Create New User
module.exports.addUser = async (req,res) =>{
    try { 
        
        const {name, email, password} = req.body;
         
        const user = await User.create(req.body);

        return res.status(201).json({message:"User Created Successfully"})
    } catch (error) {
        console.error("Error creating User:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// get All User
module.exports.viewUser = async (req,res,next) => {
    try {
        const getUser = await User.findAll()
        return res.status(200).json({getUser})
    } catch (error) {
        console.error("Error creating User:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//Update User
module.exports.updateUser = async (req,res) =>{
    try {
        const {id} = req.params

        if(!id) {
            return res
                .status(400)
                .json({message:"Please pass all the required inputs!"})
        }

        const updateUser = await User.update(
            {...req.body},
            {where : {id}}
        )

        if(updateUser[0] === 0){
            return res.status(404).json({message:"User Not Found"})
        }

        return res.status(200)
        .json({message:"User updated"})

    } catch (error) {
        console.error("Error creating User:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete User
module.exports.deleteUser = async(req,res) => {
    try {
        const {id} = req.params

        if(!id){
            return res
            .status(404)
            .json({message:"Please pass all the required inputs!"})
        }

        const user = await User.destroy( {where : { id } })

        if(user === 0){
            return res
                .status(404)
                .json({message:"User not found"})
        }

        return res
            .status(200)
            .json({message:"User deleted"})      
    } catch (error) {
        console.error("Error creating User:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
