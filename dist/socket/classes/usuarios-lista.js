"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosLista = void 0;
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista, '← La lista');
        return usuario;
    }
    actualizarNombre(id, nombre, API_ID) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                usuario.API_ID = API_ID;
                break;
            }
        }
        console.log('========== Actualizando Usuario ==========');
        console.log(this.lista);
    }
    getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre');
    }
    getUsuario(id) {
        return this.lista.find(usuario => usuario.id === id);
    }
    borrarUsuario(id) {
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id != id);
        console.log(this.lista);
        return tempUsuario;
    }
}
exports.UsuariosLista = UsuariosLista;
//# sourceMappingURL=usuarios-lista.js.map