const mongoose=require('mongoose');

objectId=mongoose.Schema.ObjectId
const UserSchema=mongoose.Schema({

    
    token: objectId,

    username:{
        type: String,
        unique: true,
        require: true
    },

    password:{
        type: String,
        require: true
    },
    rentMovie:{
        type:String,
        require:false
    },
    rentDate:{
        type:String,
        require:false
    },
    rentdelivery:{
        type:String,
        require:false 
    }
})

const UserModel = mongoose.model('user', UserSchema);
module.exports=UserModel;