"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storys_controllers_1 = require("../controllers/storys.controllers");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
router.get("/media", storys_controllers_1.MediaServer);
router.post("/story/new", upload.any(), storys_controllers_1.createStory);
router.post("/story/delete", storys_controllers_1.deleteStory);
router.post('/story', storys_controllers_1.getStorysList);
router.post("/story/profile", storys_controllers_1.getStorysByProfileID);
exports.default = router;
//# sourceMappingURL=storys.routes.js.map