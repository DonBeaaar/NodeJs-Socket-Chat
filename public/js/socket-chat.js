var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre : params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    
    // Crear evento personalizado para entrar al chat
        // Se crea callback de la respuesa
    socket.emit('entrar-chat', usuario, function (resp){
        console.log(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/* socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje.nombre,':',mensaje.mensaje);
});
// Escuchar mensaje
socket.on('enviarMensaje', function(mensaje) {
    console.log(mensaje.nombre,':',mensaje.mensaje);
});

// Escuchar información
socket.on('listaPersonas', function(mensaje) {
    console.log(`${mensaje.nombre}: ${mensaje.mensaje}`);
});