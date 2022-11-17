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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuserinfo = exports.deleteAdminUser = exports.updateAdminUserData = exports.getAdminUserList = exports.signupAdmin = exports.loginAdmin = void 0;
const Jwt = __importStar(require("jsonwebtoken"));
const byc = __importStar(require("bcryptjs"));
const panelAdminModels_1 = require("../models/panelAdminModels");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const returnmodels_1 = require("../models/returnmodels");
const firestore_1 = require("firebase-admin/firestore");
const configModule_1 = require("../libs/configModule");
var uid = require("uniqid");
function getToken(data) {
    return Jwt.sign(data, configModule_1.AppMainConfig.secretJWT, { expiresIn: '24h' });
}
function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pass = req.body.password;
        const user = (0, panelAdminModels_1.adminUserModel)(req.body);
        const userDoc = DatabaseRoutes_1.fsAdminPanelUsers.doc(user.username);
        if (!(yield userDoc.get()).exists) {
            (0, returnmodels_1.returnBadReq)(res, { message: "Usuario no existe" });
            return;
        }
        const userData = (0, panelAdminModels_1.adminUserModel)((yield userDoc.get()).data());
        const status = yield byc.compare(pass, userData.password);
        if (!status) {
            (0, returnmodels_1.returnUnauthorized)(res, { message: "Contraseña incorrecta" });
            return;
        }
        try {
            const token = getToken(userData);
            userData.token = token;
            delete userData.password;
            (0, returnmodels_1.returnOK)(res, (0, panelAdminModels_1.adminUserModel)(userData, true));
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, { message: "error intente nuevamente" });
        }
    });
}
exports.loginAdmin = loginAdmin;
function signupAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pass = req.body.password;
        const user = (0, panelAdminModels_1.adminUserModel)(req.body);
        if ((yield DatabaseRoutes_1.fsAdminPanelUsers.where("username", "==", user.username).get()).size > 0) {
            (0, returnmodels_1.returnConflict)(res, { message: "ya existe un usuario" });
            return;
        }
        try {
            user.uid = uid();
            var token = getToken(user);
            const salt = yield byc.genSalt(5);
            user.password = yield byc.hash(pass, salt);
            user.dateCreated = firestore_1.Timestamp.now();
            var final = (0, panelAdminModels_1.adminUserModel)(user, true);
            final.token = token;
            DatabaseRoutes_1.fsAdminPanelUsers.doc(user.username).set(user).catch((err) => {
                (0, returnmodels_1.returnServerError)(res, err);
            }).then((v) => {
                delete final.password;
                (0, returnmodels_1.returnOK)(res, final);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, { message: "error intente nuevamente" });
        }
    });
}
exports.signupAdmin = signupAdmin;
function getAdminUserList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var final = [];
        const usersList = yield DatabaseRoutes_1.fsAdminPanelUsers.get();
        usersList.forEach((user) => {
            var userdata = (0, panelAdminModels_1.adminUserModel)(user.data(), true);
            delete userdata.password;
            final.push(userdata);
        });
        (0, returnmodels_1.returnOK)(res, final);
    });
}
exports.getAdminUserList = getAdminUserList;
function updateAdminUserData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var userInput = (0, panelAdminModels_1.adminUserModel)(req.body);
        const userDoc = DatabaseRoutes_1.fsAdminPanelUsers.doc(userInput.username);
        if (!(yield userDoc.get()).exists) {
            (0, returnmodels_1.returnBadReq)(res, { message: "Usuario no existe" });
            return;
        }
        const userdata = (yield userDoc.get()).data();
        Object.keys(userInput).map((val) => {
            userdata[val] = (userInput[val] != "" || userInput[val] != undefined) ? userInput[val] : undefined;
        });
        if (userInput.password != undefined && userInput.password != "") {
            const salt = yield byc.genSalt(5);
            userInput.password = yield byc.hash(userInput.password, salt);
        }
        else {
            delete userInput.password;
        }
        if (!req.body.roll) {
            delete userInput.roll;
        }
        const token = getToken(userInput);
        delete userInput.username;
        userDoc.update(userInput).catch((err) => {
            (0, returnmodels_1.returnServerError)(res, err);
        }).then((v) => {
            userInput.token = token;
            (0, returnmodels_1.returnOK)(res, userInput);
        });
    });
}
exports.updateAdminUserData = updateAdminUserData;
function deleteAdminUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (0, panelAdminModels_1.adminUserModel)(req.body);
        const userdoc = DatabaseRoutes_1.fsAdminPanelUsers.doc(user.username);
        try {
            if (!(yield userdoc.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, { message: "Usuario no encontrado" });
                return;
            }
            userdoc.delete().catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, { message: "Usuario eliminado" });
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.deleteAdminUser = deleteAdminUser;
function getuserinfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInput = (0, panelAdminModels_1.adminUserModel)(req.body);
        const userDoc = DatabaseRoutes_1.fsAdminPanelUsers.doc(userInput.username);
        if (!(yield userDoc.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "usuario no encontrado" });
            return;
        }
        const userData = (0, panelAdminModels_1.adminUserModel)((yield userDoc.get()).data(), true);
        delete userData.password;
        (0, returnmodels_1.returnOK)(res, userData);
    });
}
exports.getuserinfo = getuserinfo;
//# sourceMappingURL=adminPanel.js.map