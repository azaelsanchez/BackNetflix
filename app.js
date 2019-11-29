const express = require('express');
const mongoose = require('mongoose');
const TokenModel = require('./models/token');
const MovieModel = require('./models/Movie');
const GenreModel = require('./models/Genre');
const UserModel = require('./models/User');
const auth = require('./middlewares/auth')
const ObjectId = require('mongodb').ObjectID;




const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE");
    next();
});


app.use(express.json());



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

//Peliculas

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

//Endpoint de registro de usuarios
app.post('/user/register',(req,res) =>{
  
    let nuevoUser = new UserModel()
            nuevoUser.username = req.body.username,
            nuevoUser.password = req.body.password,
            nuevoUser.email = req.body.email,
            nuevoUser.rentMovie = "",
            nuevoUser.rentDate = null,
            nuevoUser.rentdelivery = null,
            nuevoUser.login = false
        
            nuevoUser.save((err,userGuardado)=>{
            if(err){

                return res.send("Upss ocurrio un error al guardar los datos: "+err)
            }
            res.send(userGuardado +" guardado con exito")

        })
        
    })

//Endpoint de login para el usuario y si es correcto se genera un Token
app.patch('/user/login', (req, res) => {
    const userExist = req.body.username;
    const passwordIsValid = req.body.password;

    UserModel.find({
        username: userExist
    }, (err, validUser) => {
        if (err) {
            return res.send("Error. " + err)
        }
        if (!validUser.length) {
            return res.send("Upss tu usuario o contraseña no es correcto")
        }
        if (validUser[0].password !== passwordIsValid) {
            return res.send("Upss tu usuario o contraseña no es correcto")
        }

        if (validUser[0].login) {

            return res.send("Usuario ya logeado.")
        }

        token = new TokenModel()
        console.log('esto es un error', validUser)
        token.userId = validUser[0]._id
        token.save()
        validUser[0].token = token._id
        validUser[0].login = true
        validUser[0].save()
        respuestaToken = validUser[0].token.toString()
        res.send("Login de " + validUser[0].username + " realizado con exito. TOKEN: " + respuestaToken)

    })

})


//Buscamos peliculas segun el titulo
app.get("/movie/title/:title",(req, res)=>{

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
app.get('/user/profile', auth, (req, res) => {

    const insertToken = ObjectId(req.headers.auth)
    UserModel.find({
        token: insertToken
    }, (err, userValid) => {
        if (err) {

            return res.send('Upss ocurrio un error')
        }

        if (!userValid[0]) {

            return res.send('Usuario no encontrado en la base de datos')

        }

        res.send(`Bienvenido ${userValid[0].username}, logeado con exito
             
             ${userValid[0]}`)

    }).select('username rentMovie rentDate rentdelivery')

})

app.post('/user/profile/order', auth, (req, res) => {

    let title = new RegExp(req.body.title, "i");

    const insertToken = ObjectId(req.headers.authorization)
    UserModel.find({
        token: insertToken
    }, (err, userValid) => {
        if (err) {

            return res.send('Ha habido un error')
        }

        if (!userValid[0]) {


            return res.send('No se ha encontrado el usuario en la base de datos')

        }
        if (userValid[0].rentMovie !== "") {
            return res.send('El usuario ya tiene una pelicula alquilada')
        }

        MovieModel.find({
            title: title
        }, (err, movie) => {
            if (err) {
                return res.send('Upss ocurrio un error')
            }
            if (!title) {
                return res.send('Esa pelicula no existe en la base de datos')
            }
            userValid[0].rentMovie = movie[0].title
            userValid[0].filmId = movie[0]._id
            const currentDate = new Date()
            
            userValid[0].rentDate = currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()
           
            const tiempoAlquiler = 4
            userValid[0].rentdelivery = (currentDate.getDate()+tiempoAlquiler)+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()
            
            userValid[0].save((err, saved)=>{
                if (err){
                    return res.send('Ocurrio un error al guardar')
                }
                 res.send('Guardado correctamente'+saved)
            })
        })

    }).select('username rentMovie rentDate rentdelivery')

})

//Endpoint de Logout.
app.patch('/user/logout', (req, res) => {
    const userExist = req.body.username
    UserModel.find({
        username: userExist
    }, (err, validUser) => {
        if (err) {
            console.log("Upss ocurrio un error")
            return res.send("HUpss ocurrio un error: " + err)
        }
        if (!validUser.length) {
            console.log(validUser)
            return res.send("El usuario no existe.")
        }
        if (!validUser[0].login) {
            return res.send("Usuario no logeado.")
        }
        userToken = validUser[0].token
        validUser[0].login = false
        validUser[0].token = null
        validUser[0].save()

        TokenModel.findByIdAndDelete(userToken, (err, tokenRemoved) => {
            if (err) {
                return res.send('Ha habido un error' + err)
            }
            tokenRemoved.remove();
        })

        res.send('El usuario se ha deslogeado con exito')
    })

})

app.listen(3002, () =>console.log ("Server Funcionando en el puerto 3002")); // El 3000 me sale en uso y no se por que.

module.exports = app;
