  
const mongoose = require('mongoose')

objectId = mongoose.Schema.ObjectId;

const TokenSchema = mongoose.Schema({

    userId: objectId

})

const TokenModel = mongoose.model('token', TokenSchema);
module.exports=TokenModel;