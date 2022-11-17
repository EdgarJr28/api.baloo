"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../config/server");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket = __importStar(require("../libs/socket"));
class ServerSocket {
    constructor() {
        this.app = server_1.APP;
        this.port = server_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            allowEIO3: true,
            cors: {
                credentials: true,
                origin: `*`,
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"]
            }
        });
        this.escucharSockets();
    }
    static get instance() {
        return this._intance || (this._intance = new this());
    }
    escucharSockets() {
        try {
            var connSocket = true;
            console.log("|------- ", Date(), " -------|");
            console.log(`Escuchando conexiones - sockets: `, connSocket);
            this.io.on('connection', (cliente) => {
                console.log(`Cliente conectado con ID:  ${cliente.id}`);
                socket.configurarUsuario(cliente, this.io);
                socket.obtenerUsuarios(cliente, this.io);
                socket.conectarCliente(cliente);
                socket.mensaje(cliente, this.io);
                socket.desconectar(cliente, this.io);
                socket.errorConexSocket(cliente, this.io);
                socket.mensajePrivado(cliente, this.io);
            });
        }
        catch (e) {
            var connSocket = false;
            console.log(`Escuchando conexiones - sockets: `, connSocket);
            console.log(e.message);
        }
    }
    start(callback) {
        try {
            this.httpServer.listen(this.port, callback);
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.default = ServerSocket;
//# sourceMappingURL=serverSockets.js.map