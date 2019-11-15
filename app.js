
const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const mongoose = require('mongoose');
const MovieModel = require('./models/Movie');

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

 
// Routers
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
            return res.status(500).send({mesaje: err})
        }
        if(!id){
            console.log("Nada encontrado")
            return res.status(500).send({mesaje:"Pelicula no encontrada"})
        }
        console.log("la pelicula es" + movie)
        res.send(movie)
    })
})

app.listen(3002, () =>console.log ("Server Funcionando en el puerto 3002"));

module.exports = app;
