"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensajePrivado = exports.errorConexSocket = exports.obtenerUsuarios = exports.configurarUsuario = exports.mensaje = exports.desconectar = exports.salaPesonal = exports.mensajePersonal = exports.conectarCliente = exports.usuariosConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../models/usuario");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
const conectarCliente = (cliente) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    cliente.join("1234");
    exports.usuariosConectados.agregar(usuario);
};
exports.conectarCliente = conectarCliente;
const mensajePersonal = (cliente, io) => {
    cliente.on("mensaje-personal", (payload) => __awaiter(void 0, void 0, void 0, function* () {
        io.to(payload.para).emit("mensaje-personal", payload);
    }));
};
exports.mensajePersonal = mensajePersonal;
const salaPesonal = (cliente, uid) => {
    cliente.join(uid);
    console.log(`client whit UID : ${uid} conected.`);
};
exports.salaPesonal = salaPesonal;
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
    try {
        cliente.on('configurar-usuario', (payload, callback) => {
            exports.usuariosConectados.actualizarNombre(cliente.id, payload.nombre, payload.id);
            (0, exports.salaPesonal)(cliente, payload.id);
            io.emit('usuarios-activos', exports.usuariosConectados.getLista());
            callback({
                ok: true,
                mensaje: `Usuario ${payload.nombre} configurado`
            });
        });
    }
    catch (e) {
        throw new Error(e.message);
    }
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