
const express = require('express');
//const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const mongoose = require('mongoose');
const TokenModel = require('./models/token');
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

//Buscamos peliculas por genero en este Endpoint por genero
app.get("/movie/genre/:genre", (req, res) => {
 
    genre = new RegExp(req.params.genre, "i")

    GenreModel.find({
        name: genre
    }, (err, movie) => {
        if (err) {
            
            return res.send("Error al guardar los datos: "+err)
        }
        if (!genre) {
            
            return res.send("Genero introducido no valido.")

        }
        
        movieGenre = movie
        movieGenreId=parseInt(movieGenre[0].id)
        
        MovieModel.find({
            genre_ids: movieGenreId
        }, (err, movie) => {
            if(err){
                return res.send("Error en la busqueda: "+ err)
            }
            if(!movieGenreId){
               
                
                return res.send("No existe ese genero")
            }
            res.send(movie)
        })

    })
})

//Endpoint de registro de usuarios
app.post('/user/register',(req,res) =>{
  
    let nuevoUser = new UserModel()
            nuevoUser.username = req.body.username,
            nuevoUser.password = req.body.password
        
            nuevoUser.save((err,userGuardado)=>{
            if(err){

                return res.send("Ha habido un error al guardar los datos: "+err)
            }
            res.send(userGuardado +" guardado con exito")

        })
        
    })

//Endpoint de login para el usuario y si es correcto se genera un Token
app.post('/user/login', (req, res)=>{
    user = req.body.username;
    passwordValid = req.body.password;
    
    UserModel.find({username: user}, (err, userValido)=>{
        if (err){
            return res.send("Error. "+err)
        }
        if(!userValido.length){
            return res.send("usuario no encontrado")
        }
        if(userValido[0].password !==passwordValid){
            return res.send("contraseña incorrecta")
        }
        
        token = new TokenModel()
        token.userId = userValido[0]._id;
        token.save()
        res.send("login correcto")
        
    })
    
})

    

app.listen(3005, () =>console.log ("Server Funcionando en el puerto 3005")); // El 3000 me sale en uso y no se por que.

module.exports = app;
