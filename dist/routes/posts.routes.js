"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const posts_controller_1 = require("../controllers/posts/posts.controller");
const functions_1 = require("../libs/functions");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
router.post('/post', posts_controller_1.mixedPost);
router.post('/post/list', posts_controller_1.getListPost);
router.post('/post/new', upload.any(), posts_controller_1.createPosts);
router.post("/post/like", posts_controller_1.likePost);
router.post('/post/get', posts_controller_1.getPostByID);
router.post("/post/edit", upload.any(), posts_controller_1.editPosts);
router.post("/post/delete", posts_controller_1.deletePosts);
router.post("/profile", functions_1.getProfileDataData);
exports.default = router;
//# sourceMappingURL=posts.routes.js.map