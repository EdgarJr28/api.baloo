"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = exports.APP = void 0;
const express_1 = __importDefault(require("express"));
exports.APP = (0, express_1.default)();
exports.SERVER_PORT = Number(process.env.PORT) || 5001;
//# sourceMappingURL=server.js.map