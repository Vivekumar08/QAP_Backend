const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    rate:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    suggestions:{
        type:String,
        required:true
    }
})


const User = mongoose.model('USER',feedSchema);
module.exports=User;