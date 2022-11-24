const Notification = require('../Models/notification.model')
exports.postNotification = async (req,res)=>{
       
    const notificationObj = {
        subject:req.body.subject,
        body:req.body.body,
        requestor:req.body.requestor,
        ticketId:req.body.ticketId,
        recipients:req.body.recipients
    };

    try{
            const notificationData = await Notification.create(notificationObj);
                return res.status(201).send({
                    requestId : notificationData.ticketId,
                    status:"Request Accepted!",
                    success:true
                })
        }catch(err){
        return res.status(500).send({
            message:"Error in Sending the Notification",
            success:false
        })
    }
}

exports.getNotification = async(req,res)=>{
    console.log(req.params.id)
        try{
               const notificationData = await Notification.findOne({
                ticketId:req.params.id
               })
               return res.status(201).send({
                status:notificationData.status
               })
        }catch{
            return res.status(500).send({
                message:"Error in Get the Notification!",
                success:false
            })
        }
}