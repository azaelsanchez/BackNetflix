const mongoose = require('mongoose')

const GenreSchema = mongoose.Schema({

    
    id:String,

    name:String

})

const GenreModel = mongoose.model('genre', GenreSchema);
module.exports=GenreModel;