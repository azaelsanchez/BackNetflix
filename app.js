
const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const mongoose = require('mongoose');
const MovieModel = require('./models/Movie');
const GenreModel = require('./models/Genre');
const UserModel = require('./models/User');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

// app.use(logger('dev'));
 app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/movie', indexRouter);
// app.use('/users', usersRouter);

mongoose.connect("/mongodb://localhost:27017/NeflixOld",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true
    })
.then(() => console.log('conectado a mongodb'))
.catch(error => console.log('Error al conectar a MongoDB ' + error));

 
// Buscamos peliculas.
app.get('/movie',(req,res) =>{
    MovieModel.find({})
        .then(movieFind => res.send(movieFind))
        .catch(error => console.log(error))
})

app.get("/movie/:id",(req,res)=>{
    id=req.params.id;
    console.log(id)
    MovieModel.findById(id,(err,movie)=>{
        if(err){
            console.log("hay un error")
            return res.status(500).send({message: err})
        }
        if(!id){
            console.log("Nada encontrado")
            return res.status(500).send({message:"Pelicula no encontrada"})
        }
        console.log("la pelicula es" + movie)
        res.send(movie)
    })
})

app.get("/movie/:title",(req, res)=>{

    let titleName= new RegExp(req.params.title, "i");

    MovieModel.find({title:titleName},(err,movie)=>{
    if(err){
        console.log("ha habido un error "+err)
        return res.status(500).send({mesaje: err})
    }
    if(!titleName){
        console.log("Pelicula no encontrada")
        return res.status(500).send({mesaje: "movie doesn't exist"})
    }
    res.send(movie)
    })
})

//Buscamos por genero
app.get("/movie/genre/:genre", (req, res) => {

    genre = new RegExp(req.params.genre, "i")
    genreId = ""

    GenreModel.find({
        name: genre
    }, (err, docs) => {
        if (err) {
            console.log("ha habido un error " + err)
            return res.status(500).send({
                mesaje: err
            })
        }
        if (!genre) {
            console.log("no lo encuentra")
            return res.status(500).send({
                mesaje: "genre doesn't exist"
            })

        }

        let movieGenre = docs
        console.log(movieGenre)
        for (let i = 0; i < movieGenre.length; i++) {
            console.log(movieGenre[i].id)

            if (movieGenre[i].name == genre) {

                genreId = movieGenre[i].id
                console.log(genreId)
            }
        }

        MovieModel.find({
            genre_ids: 28
        }, (err, movie) => {
            res.send(movie)
        })

    })
})


//Modo usuarios
app.get('/user', (req, res) => {
    UserModel.find({})
        .then(users => res.send(users))
        .catch(error => console.log(error))
})
app.post('/user/register', async (req, res) => {
    try {
        const user = await new UserModel({
            username: req.body.username,
            password: req.body.password
        }).save()
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})
app.patch('/user/:id', (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, {
        username: req.body.username
    },{new:true,useFindAndModify:false})
    .then(user=>res.send(user))
    .catch(error=>console.log(error))
})

app.listen(3002, () =>console.log ("Server Funcionando en el puerto 3002")); // El 3000 me sale en uso y no se por que.

module.exports = app;
