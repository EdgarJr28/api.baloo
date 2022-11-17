"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const index_controllers_1 = require("../controllers/index.controllers");
const user_controller_1 = require("../controllers/user.controller");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
router.post("/user/resetpassword", index_controllers_1.resetPassword);
router.get("/users", user_controller_1.getAllUsers);
router.post('/user/profileimg', upload.any(), user_controller_1.profileImage);
router.post('/user/infoupdate', upload.any(), user_controller_1.updateUserFirebase);
router.post('/user/getuser', user_controller_1.getUsersFirebase);
router.post('/user/get', user_controller_1.getUsersFirebase);
router.post("/user/login", (0, express_validator_1.body)("email").isEmail(), index_controllers_1.login);
router.post("/user/signup", index_controllers_1.signUp);
router.post("/user/signupExt/:type", index_controllers_1.signUpExt);
router.post("/user/sendsms", index_controllers_1.smsResender);
router.post("/user/validatesms", index_controllers_1.validateSMS);
router.post("/user/delete", user_controller_1.deleteUser);
router.post("/user/clearDataUser", user_controller_1.clearDataUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map