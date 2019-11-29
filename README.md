# Backend de una copia de Netflix

Tenemos los Endpoints de Usuario,Registro de usuario, Login de usuario, Logout de usuario, Movie, Movie por id, Movie por titulo, Movie por genero, Perfil de usuario y Desde el perfil solicitar una pelicula para alquilar.

######### Buscar pelicula por el _id
http://localhost:3005/movie/5dcc3481ed02866326e6c6dd

######### Login del usuario creado

PATCH http://localhost:3005/user/login
Content-Type: application/json

{
    "username": "nombre de usuario",
    "password":"contraseña"
}


######### Logout del usuario
PATCH http://localhost:3005/user/logout
Content-Type: application/json

{
    "username": "nombre de usuario",
    "password":"contraseña"
}

######### Alquiler de peliculas segun el usuario.

post http://localhost:3005/user/profile/order
authorization: Token generado
Content-Type: application/json

{
    "title": "nombre de pelicula"
}


######### Registro de Usuarios

POST http://localhost:3005/user/register
Content-Type: application/json

{
    "username": "nombre de usuario",
    "password":"contraseña"
}
