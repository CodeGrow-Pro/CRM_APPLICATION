const Client = require('node-rest-client').Client;
const client = new Client();
module.exports = (ticketId,subject,body,recipients,requestor)=>{
    const requestBody = {
        subject,
        body,
        recipients,
        requestor,
        ticketId
    }
    const reqHeader = {
        "Content-Type":"application/json"
    }
    const args = {
        data:requestBody,
        headers:reqHeader
    }
    try{
        client.post(process.env.NOTIFICATION_SEND_URL,args,(err,data)=>{
                      if(err){
                        return console.log(err);
                      }
                      console.log('post client block'+data)
        })
    }catch(err){
        return console.log(err)
    }
}