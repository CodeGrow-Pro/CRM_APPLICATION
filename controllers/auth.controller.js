const bcrypt = require('bcrypt');
const userModel = require('../Models/user.model');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken')
const userConverter = require('../objectConverter/userObjectConverter');
const isValiedConstant = require('../constant/constant')
exports.signup = async (req, res) => {
    const body = req.body;
    let userStatus;
    const userType = body.userType;
    if (userType == 'CUSTOMER') {
        userStatus = 'APPROVED';
    } else {
        userStatus = 'PENDING';
    }
    const userObj = {
        name: body.name,
        userId: body.userId,
        email: body.email,
        userType: userType,
        userStatus: userStatus,
        password: bcrypt.hashSync(body.password, 8)
    }
    try {
        const userResponse = await userModel.create(userObj)
        const responseObj = {
            name: userResponse.name,
            userId: userResponse.userId,
            email: userResponse.email,
            userType: userResponse.userType,
            userStatus: userResponse.userStatus,
            createdAt: userResponse.createdAt,
            updatedAt: userResponse.updatedAt
        }
        return res.status(201).send({
            message:"signup sucessfully!",
            success:true
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            message: 'Internal server error!',
            success:false
        })
    }
}

exports.signin = async (req, res) => {
    //retrieve input from req object
    const body = req.body;
    const userId = body.userId;
    const password = body.password;
    try {
        const user = await userModel.findOne({
            userId: userId
        });
        var passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
             return res.status(401).send({
                message: "Invalied password",
                success:false
            })
        }
        if (user.userStatus !== 'APPROVED') {
            return res.status(401).send({
                message: "Your are not Approved Wait some time ",
                Status:user.userStatus
            });
        }
        var token  = jwt.sign({userId:user.userId },config.secret,
           { expiresIn:'1d'}
        )
        return res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userTypes: user.userType,
            userStatus: user.userStatus,
            accessToken: token
        });
    } catch (err) {
        console.log(err.message)
       return res.status(400).send({
            message: "User not found!",
            success:false
        });
    }
}

exports.findAlluser =async (req,res)=>{
    try{
               const userS = await userModel.find().exec()
                 return res.status(200).send(userConverter.multiConverter(userS));
    }catch(err){
        console.log(err.message);
         res.status(500).send({
            message:"something want wrong!",
            success:false
        })
        return;
    }
}


exports.updateUser = async(req,res)=>{
    try{
             const user =await userModel.findOne({userId:req.userId});
             if(req.body.email){
                user.email = req.body.email;
          }
           if(req.body.userType){
                 user.userType = isValiedConstant.userType[req.body.userType];
          } 
          if(!req.body.email && !req.body.userType){
               return res.status(404).send({
                   message:"Please provide the Data for update!",
                   success:false
               });
           }
           await user.save()
             return res.status(201).send({
                message:"Update SuccessFully !",
                success:true,
                updatedDetails :  userConverter.OneUserConverter(user)
             })

    }catch(err){
        console.log(err.message);
        return res.status(500).send({
            message:"Something Want Wrong!",
            success:false
        })
    }
}
