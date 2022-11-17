"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensajePrivado = exports.errorConexSocket = exports.obtenerUsuarios = exports.configurarUsuario = exports.mensaje = exports.desconectar = exports.conectarCliente = exports.usuariosConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../models/usuario");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
const conectarCliente = (cliente) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuariosConectados.agregar(usuario);
};
exports.conectarCliente = conectarCliente;
const desconectar = (cliente, io) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', exports.usuariosConectados.getLista());
    });
};
exports.desconectar = desconectar;
const mensaje = (cliente, io) => {
    cliente.on('mensaje', (payload) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
};
exports.mensaje = mensaje;
const configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (payload, callback) => {
        exports.usuariosConectados.actualizarNombre(cliente.id, payload.nombre, payload.id);
        io.emit('usuarios-activos', exports.usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        });
    });
};
exports.configurarUsuario = configurarUsuario;
const obtenerUsuarios = (cliente, io) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', exports.usuariosConectados.getLista());
    });
};
exports.obtenerUsuarios = obtenerUsuarios;
const errorConexSocket = (cliente, io) => {
    io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
};
exports.errorConexSocket = errorConexSocket;
const mensajePrivado = (cliente, io) => {
    try {
        cliente.on('mensaje-privado', (payload) => {
            console.log("entro privado");
            io.to(cliente.id).emit('mensaje-privado', payload);
        });
    }
    catch (e) {
        console.log(e.message);
        throw new Error(e.message);
    }
};
exports.mensajePrivado = mensajePrivado;
//# sourceMappingURL=socket.js.map