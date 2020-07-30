// Esta es la constante que exporta el server
const { io } = require('../server');

const Usuarios = require('../classes/usuarios');

const usuarios = new Usuarios();
const { crearMensaje } = require('../utils/utils');


io.on('connection', (client) => {

    console.log('Usuario conectado, yo soy BACKEND');
    // client.on | evento | payload
    client.on('entrar-chat',(data, callback)=>{
        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                message: 'El nombre y la sala son necesarios'
            })
        }

        // Agregar usuario a sala
        client.join(data.sala);
        usuarios.agregarPersona(client.id,data.nombre,data.sala);
        let personas = usuarios.getPersonasSala(data.sala)
        // Ahora debemos notificar solamente a las personas que están en la misma sala
            // client.broadcast.to(data.sala).emit(...)
        client.broadcast.to(data.sala).emit('listaPersonas',crearMensaje('Administrador',`${data.nombre} se unió el chat`));
        callback(personas);
    })

    client.on('enviarMensaje',(data)=>{
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        client.broadcast.to(persona.sala).emit('enviarMensaje',mensaje);
    });

    // Enviar mensaje privado
    client.on('mensajePrivado',(data)=>{
        let persona = usuarios.getPersona(client.id);
        // Se agrega .to('id del socket');
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));
    })

    // Evento de desconexión
    client.on('disconnect',()=>{
        console.log('Se desconectó un usuario');
        let personaBorrada = usuarios.borrarPersona(client.id);
        // Informar a todos los usuarios con un evento personalizado
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',crearMensaje('Administrador',`${personaBorrada.nombre} abandonó el chat`));
    })

});