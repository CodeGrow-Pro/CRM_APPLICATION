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
            success:true,
            userSummry : responseObj
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            message: 'Failure in signup!',
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
        if (user == null) {
            res.status(400).send({
                message: "User not found!"
            });
        }
        var passwordIsValid = bcrypt.compareSync(body.password, user.password);
        if (!passwordIsValid) {
             res.status(401).send({
                message: "Invalied password"
            })
        }
        if (user.userStatus !== 'APPROVED') {
            return res.status(200).send({
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
            message: "User not found!"
        });
    }
}

exports.findAlluser =async (req,res)=>{
    try{
               const user = await userModel.find().exec()
               if(user){
                 res.status(200).send({
                    message:"fetch user data successfully!",
                    success:true,
                       usersDetails : user
                });
                return;
               }
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
               return res.status(401).send({
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
