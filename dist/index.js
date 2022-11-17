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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const createFolders_1 = require("./libs/createFolders");
const config_database_1 = __importDefault(require("./config/config.database"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const config_routes_1 = __importDefault(require("./routes/config.routes"));
const animals_routes_1 = __importDefault(require("./routes/animals.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const services_routes_1 = __importDefault(require("./routes/services.routes"));
const medicalRecord_routes_1 = __importDefault(require("./routes/medicalRecord.routes"));
const storys_routes_1 = __importDefault(require("./routes/storys.routes"));
const posts_routes_1 = __importDefault(require("./routes/posts.routes"));
const matchs_routes_1 = __importDefault(require("./routes/matchs.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const follow_route_1 = __importDefault(require("./routes/follow.route"));
const adminPanel_routes_1 = __importDefault(require("./routes/adminPanel.routes"));
const applesigin_routes_1 = __importDefault(require("./routes/applesigin.routes"));
const configModule_1 = require("./libs/configModule");
const publicity_routes_1 = __importDefault(require("./routes/publicity.routes"));
const serverSockets_1 = __importDefault(require("./socket/config/serverSockets"));
const server_1 = require("./socket/config/server");
(0, config_database_1.default)();
dotenv.config({ path: path_1.default.resolve("./.env") });
const server = serverSockets_1.default.instance;
(0, configModule_1.perareConfig)();
(0, createFolders_1.createFolders)();
server_1.APP.use(express_1.default.json());
server_1.APP.use(express_1.default.urlencoded({ extended: false }));
server_1.APP.use((0, cors_1.default)());
server_1.APP.use((0, express_2.default)());
server_1.APP.use((0, morgan_1.default)('dev'));
server_1.APP.use('/uploads', express_1.default.static(path_1.default.resolve()));
server_1.APP.use(index_routes_1.default);
server_1.APP.use(config_routes_1.default);
server_1.APP.use(animals_routes_1.default);
server_1.APP.use(user_routes_1.default);
server_1.APP.use(services_routes_1.default);
server_1.APP.use(medicalRecord_routes_1.default);
server_1.APP.use(storys_routes_1.default);
server_1.APP.use(posts_routes_1.default);
server_1.APP.use(matchs_routes_1.default);
server_1.APP.use(follow_route_1.default);
server_1.APP.use(adminPanel_routes_1.default);
server_1.APP.use(applesigin_routes_1.default);
server_1.APP.use(publicity_routes_1.default);
server_1.APP.use(chat_routes_1.default);
var a = process.env;
server.start(() => {
    console.log("|------- ", Date(), " -------|");
    console.log("Server Listening on port: ", server_1.SERVER_PORT);
});
//# sourceMappingURL=index.js.map