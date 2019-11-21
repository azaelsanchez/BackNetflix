UserModel = require ('../models/User')
TokenModel = require ('../models/token')
mongoose = require ('mongoose')
ObjectId = require ('mongodb').ObjectId;

function authOk (req, res, next){

    const autorizacion = req.headers.authorization;
    console.log('Tu autorizacion es ' +autorizacion)
    

    if (!autorizacion){
        return res.send("Te falta autorizacion")
    }
    if (autorizacion.split("").length !== 24){
    
        return res.send("El token no es valido")
    }
    const insertToken = ObjectId(autorizacion)

    UserModel.find({token: insertToken}, (err, userValid)=>{
        if(err){
            return res.send('Ocurrio un error '+err)
        }
        if (!userValid[0]){
            return res.send('Upss el Token o no es valido o expiro')
        }
        
        next()        

    })
    
   
}

module.exports = authOk

