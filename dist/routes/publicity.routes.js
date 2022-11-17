"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const Publicity_1 = require("../controllers/Publicity");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const pubRoutes = (0, express_1.Router)();
const storage = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
pubRoutes.post("/pub/new", storage.any(), Publicity_1.createPub);
pubRoutes.post("/pub/list", Publicity_1.getPubList);
pubRoutes.post("/pub/del", Publicity_1.delPubData);
exports.default = pubRoutes;
//# sourceMappingURL=publicity.routes.js.map