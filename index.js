require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const routes = require('./routes/api/index');
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}));
app.get('/',(req,res)=>{
    return res.status(200).send("<hr><h1 style='padding:250px'>Welcome To Our CRM APP</h1><hr>");
})
app.use("/crm/api",routes);
module.exports = app;
