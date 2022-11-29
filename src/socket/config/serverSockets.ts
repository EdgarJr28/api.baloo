
import express from 'express';
import { SERVER_PORT, APP } from '../config/server';
import http from 'http';
import { Server, Socket } from "socket.io";
import * as socket from '../libs/socket';
import { Request, Response } from 'express'


export default class ServerSocket {

    private static _intance: ServerSocket;

    public app: express.Application;
    public port: any;
    public io: Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = APP;
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = new Server(this.httpServer, {
            allowEIO3: true, // false by default
            cors: {
                credentials: true,
                origin: `*`,
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"]
            }
        });

        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || (this._intance = new this());
    }


    private escucharSockets() {

        try {
            var connSocket: boolean = true;
            console.log("|------- ", Date(), " -------|");
            console.log(`Escuchando conexiones - sockets: `, connSocket);

            this.io.on('connection', (cliente) => {

                console.log(`Cliente conectado con ID:  ${cliente.id}`);

                // Configurar usuario
                socket.configurarUsuario(cliente, this.io);

                // obtener Usuarios Activos
                socket.obtenerUsuarios(cliente, this.io)

                // sala personal para mensajes
                socket.mensajePersonal(cliente, this.io)

                // Mensajes
                socket.mensaje(cliente, this.io);

                // Desconectar
                socket.desconectar(cliente, this.io);
                
                // error en el socket 
                socket.errorConexSocket(cliente, this.io);

            });

        } catch (e: any) {
            var connSocket: boolean = false;
            console.log(`Escuchando conexiones - sockets: `, connSocket);
            console.log(e.message);
        }

    }


    start(callback: any) {
        try {
            this.httpServer.listen(this.port, callback);
        } catch (e: any) {
            console.log(e.message)
        }


    }

}