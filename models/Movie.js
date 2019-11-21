const mongoose = require ('mongoose');

const MovieSchema = mongoose.Schema({

    popularity: Number,
    vote_count: Number,
    video: Boolean,
    poster_path: {
        type: Number,
        required: true
    },

    id:{
        type: String,
        required: true
    },
    adult: Boolean,
    backdrop_path: String,
    original_language: String,
    original_title: {
        type: String,
        required: true
    },
    genre_ids:{ 
        type: Array,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    vote_average: Number,
    overview: String,
    release_date: Number
})

const MovieModel = mongoose.model('movie',MovieSchema);
module.exports=MovieModel;