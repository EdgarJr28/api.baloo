import { Usuario } from "../models/usuario";



export class UsuariosLista {

    private lista: Usuario[] = [];

    constructor() {

    }

    public agregar(usuario: Usuario) {
        this.lista.push(usuario)
        console.log(this.lista, '← La lista')
        return usuario;

    }


    public actualizarNombre(id: string, nombre: string, API_ID: string) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                usuario.API_ID = API_ID;
                break;
            }
        }
        console.log('========== Actualizando Usuario ==========')
        console.log(this.lista)
    }

    // Obtener Lista Usuarios
    public getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre');
    }


    public getUsuario(id: string) {
        return this.lista.find(usuario => usuario.id === id)
    }

    // Borrar Usuario

    public borrarUsuario(id: string) {
        const tempUsuario = this.getUsuario(id)
        this.lista = this.lista.filter(usuario => usuario.id != id)

        console.log(this.lista)


        return tempUsuario;
    }
}