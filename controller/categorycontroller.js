const { category } = require('../models')

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