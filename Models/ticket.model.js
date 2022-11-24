const mongoose =require('mongoose');
const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ticketPeiority:{
        type:Number,
        required:true,
        default:4
    },
    status:{
        type:String,
        required:true,
        default:'OPEN'
    },
    reporter:{
        type:String
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>{
            return  Date.now()
        }
    },
    createdAt:{
        type:Date,
        default:()=>{
            return  Date.now()
        }
    },
    assignee:String
})
const tiketModel = mongoose.model('ticket',ticketSchema);
module.exports =tiketModel;