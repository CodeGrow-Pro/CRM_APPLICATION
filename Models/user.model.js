const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unique:true
    },
    createdAt: {
        type:Date,
        immutable:true,
        default:()=>{
            return Date.now();
        }
    },
    updatedAt: {
        type:Date,
        default:()=>{
            return Date.now();
        }
    },
    userType: {
       type:String,
       required:true,
        default:'Customer'
    },
    userStatus:{
        type:String,
        required:true,
        default:"APPROVED"
    },
    ticketsCreated : {
        type : [mongoose.SchemaTypes.ObjectId],
        ref : "ticket"
        },
        ticketsAssigned : {
        type : [mongoose.SchemaTypes.ObjectId],
        ref : "ticket"
        }
    
})

const userCollection = new mongoose.model('user',userSchema);
module.exports = userCollection;