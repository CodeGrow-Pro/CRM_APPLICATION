const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config')
exports.verifyToken = (req,res,next)=>{
    if(!req.headers["authorization"]){
        return res.status(401).send({
            message:"You are not Authorized user for this APIs",
            success: false
        });
    }
    const token = req.headers["authorization"].split(' ')[1];
    if(!token){
        res.status(403).send({
            message:"token not found!"
        });
    }
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
            res.status(401).send({
                message:"Unauthorized!"
            })
        }
        req.userId = decoded.userId;
        next();
    })
}