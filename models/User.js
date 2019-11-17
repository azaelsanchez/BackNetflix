const mongoose=require('mongoose');

objectId=mongoose.Schema.ObjectId
const UserSchema=mongoose.Schema({

    token: objectId,

    username:{
        type: String,
        unique: true,
        required: true
    },

    password:{
        type: String,
        require: true
    }
})

const UserModel = mongoose.model('user', UserSchema);
module.exports=UserModel;