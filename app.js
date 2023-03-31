const express = require('express');
const dotenv =require('dotenv');
var cookieParser = require('cookie-parser')
const app =express();

dotenv.config({path:'./config.env'})
require('./db/conn')

app.use(express.json());
app.use(cookieParser());

require('./models/feedSchema')
const PORT = process.env.PORT || 5000;


app.use(require('./router/auth'))


app.get('/contact',(req,res)=>{
    res.send("this is from contact")
})

app.listen(PORT,()=>{
    console.log(`Server at port ${PORT}`);
})