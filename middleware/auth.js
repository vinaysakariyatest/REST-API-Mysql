const jwt = require("jsonwebtoken");

module.exports.check_token = async (req,res,next) => {
    try {
        // jwt.verify(req.headers.authorization,process.env.SECRET_KEY,next)  
        // const token = req.cookies.jwt
        const token = req.headers.authorization
        console.log(token)
        const decoded = jwt.verify(token,process.env.SECRET_KEY)
        req.userData = decoded;
        next();
    } catch (error) {
        // console.error("Error creating Post:", error);
        return res.status(401).json({ message: "Unauthorized access"});
    }
}

