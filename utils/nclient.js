const Client  = require('node-rest-client').Client
const client = new Client();

exports.sendEmail = (payload)=>{
    const args = {
        headers:{
            'content-Type':"application/json"
        },
        body:{
            "subject":payload.subject,
            "content":payload.content,
            "recepientEmails":payload.recipientrs,
            "requester":payload.requester,
            "ticketId":payload.ticketId
        }
    }
    client.post('http://localhost:4000/notification/api/v1/notification/send',args,(err,data)=>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log(data);
})
}