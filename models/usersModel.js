const mongoose = require('mongoose')

const {Schema} = mongoose

const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        minlength : 3,
        maxlength : 30,
    },
    lastName : {
        type: String,
        required : true,
        minlength : 3,
        maxlength : 30,
    },
    email : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 200,
        unique : true
    },
    password: {
        type : String,
        unique : true,
        required : true
    },
  
    username : {
        type : String,
        required : true
    }   ,
    avatar : {
        type : String
    },
    isAvatarImageSet : {
        type  : Boolean,
        default : false
    }
}, {timestamps : true});
module.exports = mongoose.model('Users', userSchema)