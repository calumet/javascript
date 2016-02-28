var express = require('express');
var bodyParser = require('body-parser');
var database = require('./database');

// Crear aplicación del servidor.
var app = express();

// Puerto donde va a correr el servidor.
var port = 8000;


// Habilitar que el servidor reciba datos por peticiones HTTP tipo POST y PUT.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Conseguir la lista de todos los contactos.
app.get('/contacts', function (req, res) {

    database
    .getAll()
    .then(function (results) {
        res.json({
            success: true,
            data: results
        });
    },
    function (err) {
        res.json({
            error: err
        });
    });
});


// Conseguir un solo contacto por identificador.
app.get('/contact/:id', function (req, res) {

    var id = Number(req.params.id);

    database
    .getById(id)
    .then(function (contact) {
        if (contact) {
            res.json({
                success: true,
                data: contact
            });
        } else {
            res.json({
                error: 'No encontrado.'
            });
        }
    },
    function (err) {
        res.json({
            error: err
        });
    });
});


// Crear un nuevo contacto con los datos enviados por el body.
app.post('/contact', function (req, res) {

    var name = req.body.name;
    var age = Number(req.body.age);

    var newContact = {
        name: name,
        age: age
    };

    database
    .create(newContact)
    .then(function (contact) {
        res.json({
            success: true,
            data: contact
        });
    },
    function (err) {
        res.json({
            error: err
        });
    });
});


// Actualizar un contacto por el identificador y los nuevos datos que llegan
// por el body.
app.put('/contact/:id', function (req, res) {

    var id = Number(req.params.id);
    var name = req.body.name;
    var age = Number(req.body.age);

    var updateData = {
        name: name,
        age: age
    };

    database
    .updateById(id, updateData)
    .then(function (contact) {
        res.json({
            success: true,
            data: contact
        });
    },
    function (err) {
        res.json({
            error: err
        });
    });
});


// Borrar un contacto por identificador.
app.delete('/contact/:id', function (req, res) {

    var id = Number(req.params.id);

    database
    .removeById(id)
    .then(function () {
        res.json({
            success: true
        });
    },
    function (err) {
        res.json({
            error: err
        });
    });
});


// Definir la carpeta 'public' como pública.
app.use(express.static(__dirname +'/public'));


// Iniciar el servidor.
app.listen(port, function (err) {
    if (err) {
        throw err;
    }

    console.log('Servidor corriendo en http://127.0.0.1:'+ port);
});
