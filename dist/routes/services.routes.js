"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_controllers_1 = require("../controllers/services.controllers");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
router.post('/service/new', upload.any(), services_controllers_1.createService);
router.post('/service/update', upload.any(), services_controllers_1.updateService);
router.post('/service/getByUserID/', services_controllers_1.getServiceByUserId);
router.post('/service/get', services_controllers_1.getService);
router.post('/service/delete', services_controllers_1.deleteService);
router.post("/service/getlist", services_controllers_1.getServiceList);
exports.default = router;
//# sourceMappingURL=services.routes.js.map