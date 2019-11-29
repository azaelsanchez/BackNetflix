const mongoose=require('mongoose');

ObjectId=mongoose.Schema.ObjectId

const UserSchema=mongoose.Schema({
    
    token: objectId,

    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
        
    },

    password:{
        type: String,
        require: true
    },

    login: Boolean,

    filmId: ObjectId,

    rentMovie: String,

    rentDate: String,

    rentdelivery: String

})

const UserModel = mongoose.model('user', UserSchema);
module.exports=UserModel;