const app = require('./index');
const serverConfig = require('./config/server.config')
const dbconfig = require('./config/db.config')
const mongoose = require('mongoose');
console.log(`Node environment: ${process.env.NODE_EN}`);
//this pattern follow as normal

// mongoose.connect(process.env.MONGO_URI,{family:4},(err)=>{
//     if(err){
//         console.log("error Occurred" , err.message);
//     }else{
//         console.log("DataBase connected successfully!");
//         app.listen(process.env.PORT || port,()=>{
//             console.log(`Example app listening at port http://localhost:${port}`)
//         });
//     }
// })
//when i do intigretion test than this pattern follows..

 mongoose.connect(dbconfig.DB_MONGO_URI,{family:4});
 const db = mongoose.connection;
 db.on("error",()=>{
      console.log("error while connecting to DB!")
 })
 db.once("open",()=>{
    console.log("Connected to DB : " , dbconfig.DB_MONGO_URI)
 })
module.exports =  app.listen(serverConfig.PORT,()=>{
                console.log(`Example app listening at port http://localhost:${serverConfig.PORT}`)
});