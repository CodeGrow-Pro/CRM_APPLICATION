const app = require('./index');
const port = process.env.PORT;
const mongoose = require('mongoose');
console.log(`Node environment: ${process.env.NODE_ENV}`);
mongoose.connect(process.env.MONGO_URI,{family:4},(err)=>{
    if(err){
        console.log("error Occurred" , err.message);
    }else{
        console.log("DataBase connected successfully!");
        app.listen(process.env.PORT || port,()=>{
            console.log(`Example app listening at port http://localhost:${port}`)
        });
    }
})
