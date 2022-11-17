import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../models/usuario';
import { errorValidationSockets } from './errorValidation';



export const usuariosConectados = new UsuariosLista();



export const conectarCliente = (cliente: Socket) => {
    const usuario = new Usuario(cliente.id)
    usuariosConectados.agregar(usuario)

}


export const desconectar = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario(cliente.id);

        io.emit('usuarios-activos', usuariosConectados.getLista());
    });

}


// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {

        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });

}

// Escuchar mensajes
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', (payload: { nombre: string, id: string }, callback: Function) => {
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre, payload.id)
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })

    });

}

// obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });

}

export const errorConexSocket = (cliente: Socket, io: socketIO.Server) => {
    io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
}


export const mensajePrivado = (cliente: Socket, io: socketIO.Server) => {
    try {
        cliente.on('mensaje-privado', (payload: any) => {
            console.log("entro privado")
            io.to(cliente.id).emit('mensaje-privado', payload);
        });
    } catch (e: any) {
        console.log(e.message)
        throw new Error(e.message)
    }
}