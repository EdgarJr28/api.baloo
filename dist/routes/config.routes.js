"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const config_controllers_1 = require("../controllers/configs/config.controllers");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
router.post('/config/columnType', config_controllers_1.newColumnTypeHome);
exports.default = router;
//# sourceMappingURL=config.routes.js.map