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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordUser = exports.resetPassword = exports.removeSMS = exports.validateSMS = exports.smsResender = exports.loginExt = exports.signUpExt = exports.signUp = exports.login = exports.setDebug = exports.createDBAnimalsTypes = exports.indexWelcome = exports.DEBUG = void 0;
const Auth = __importStar(require("firebase/auth"));
const auth_1 = require("firebase/auth");
const verifySMS_1 = require("../libs/verifySMS");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const express_validator_1 = require("express-validator");
const configProxys_1 = require("../config/configProxys");
const returnmodels_1 = require("../models/returnmodels");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const usermodel_1 = require("../models/usermodel");
const animalsTypeDB_json_1 = __importDefault(require("../models/animalsTypeDB.json"));
const firestore_1 = require("firebase-admin/firestore");
const config_database_1 = require("../config/config.database");
const getUID = require("uniqid");
exports.DEBUG = false;
function indexWelcome(req, res) {
    console.log("Entro");
    return res.json('Welcome to the Api');
}
exports.indexWelcome = indexWelcome;
function createDBAnimalsTypes(req, res) {
    const values = animalsTypeDB_json_1.default;
    for (const key in values) {
        DatabaseRoutes_1.fsAnimalsTypeDB.doc(key).set(values[key]).then((val) => { }).catch((err) => {
            console.log(err);
        });
    }
    (0, returnmodels_1.returnOK)(res, "ok");
}
exports.createDBAnimalsTypes = createDBAnimalsTypes;
function setDebug(req, resp) {
    if (!exports.DEBUG) {
        exports.DEBUG = true;
        (0, returnmodels_1.returnOK)(resp, { messaje: "DEBUG ON" });
    }
    else {
        exports.DEBUG = false;
        (0, returnmodels_1.returnOK)(resp, { messaje: "DEBUG OFF" });
    }
}
exports.setDebug = setDebug;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let userInput = {
                email: req.body.email,
                password: req.body.password
            };
            const auth = (0, auth_1.getAuth)();
            const login = yield Auth.signInWithEmailAndPassword(auth, userInput.email, userInput.password).then((response) => __awaiter(this, void 0, void 0, function* () {
                const userResponse = {
                    uid: response.user.uid,
                    email: response.user.email,
                    token: ""
                };
                const userDoc = (DatabaseRoutes_1.fsUserCollection.doc(userResponse.uid));
                let newtoken = jsonwebtoken_1.default.sign({ id: userResponse.uid }, process.env.SECRET || config_1.default.SECRET, {
                    algorithm: "HS384",
                    expiresIn: "30 days",
                    jwtid: (userResponse.uid + "-" + userResponse.email)
                });
                yield userDoc.update({
                    token: newtoken
                });
                var userInfo = (yield userDoc.get()).data();
                userInfo.token = newtoken;
                userInfo.online = true;
                const fulldata = (0, usermodel_1.setUserModel)(userInfo, true);
                (0, returnmodels_1.returnOK)(res, fulldata);
            }));
        }
        catch (error) {
            if (error.code === "auth/user-not-found") {
                return (0, returnmodels_1.returnNotFound)(res, {
                    code: error.code,
                    message: "correo no registrado."
                });
            }
            if (error.code === "auth/wrong-password") {
                return (0, returnmodels_1.returnBadReq)(res, {
                    code: error.code,
                    message: "Usuario o contraseña incorrectos."
                });
            }
            if (error.code === "auth/too-many-requests") {
                return (0, returnmodels_1.returnUnauthorized)(res, { status: error.code, message: error });
            }
        }
    });
}
exports.login = login;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = req.body.password;
        const date = firestore_1.Timestamp.now();
        const userinfo = (0, usermodel_1.setUserModel)(req.body);
        userinfo.user.dateCreate = date;
        userinfo.user.dateUpdate = date;
        userinfo.user.verifyAccount = false;
        try {
            const usercol = DatabaseRoutes_1.fsUserCollection.where("username", "==", userinfo.user.username).get();
            if ((yield usercol).size > 0) {
                (0, returnmodels_1.returnConflict)(res, "ya existe un usuario registrado: " + userinfo.user.username);
                return;
            }
            const mailquery = DatabaseRoutes_1.fsUserCollection.where("email", "==", userinfo.user.email).get();
            if ((yield mailquery).size > 0) {
                (0, returnmodels_1.returnConflict)(res, "El correo " + userinfo.user.email + " ya se encuentra registrado");
                return;
            }
            const auth = (0, auth_1.getAuth)();
            const signUp = yield Auth.createUserWithEmailAndPassword(auth, userinfo.user.email, password).then(response => {
                const user = response.user;
                if (user) {
                    userinfo.user.uid = user.uid;
                    userinfo.token = jsonwebtoken_1.default.sign({ id: user.uid }, process.env.SECRET || config_1.default.SECRET, {
                        algorithm: "HS384",
                        expiresIn: "30 days",
                        jwtid: (user.uid + "-" + user.email)
                    });
                    const data = DatabaseRoutes_1.fsUserCollection.doc(user.uid);
                    data.set(userinfo.user).then((v) => {
                        const final = (0, usermodel_1.setUserModel)(userinfo.user, true);
                        final.token = userinfo.token;
                        final.message = "Register complete";
                        final.user.online = true;
                        (0, returnmodels_1.returnOK)(res, final);
                        prepareSMS(user.uid, (val) => { });
                    }).catch((err) => {
                        (0, returnmodels_1.returnBadReq)(res, err);
                    });
                }
            });
        }
        catch (error) {
            console.log(error);
            if (error.code === "auth/weak-password") {
                (0, returnmodels_1.returnBadReq)(res, {
                    status: error.code,
                    message: "Contraseña invalida, minimo 8 caracteres."
                });
            }
            else if (error.code === "auth/email-already-in-use") {
                (0, returnmodels_1.returnBadReq)(res, {
                    status: error.code,
                    message: "Correo invalido, este correo ya esta en uso."
                });
            }
            else {
                return res.status(401).json({
                    status: error.code,
                    message: ""
                });
            }
        }
    });
}
exports.signUp = signUp;
function signUpExt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const regexemail = /\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
        const body = req.body;
        const date = firestore_1.Timestamp.now();
        const userinfo = (0, usermodel_1.setUserModel)();
        userinfo.user.uid = getUID();
        userinfo.user.dateCreate = date;
        userinfo.user.dateUpdate = date;
        userinfo.user.verifyAccount = true;
        try {
            switch (req.params.type) {
                case "google" || "Google":
                    userinfo.user.username = body.email.split(regexemail)[0];
                    userinfo.user.email = body.email;
                    userinfo.user.imgURL = body === null || body === void 0 ? void 0 : body.photoUrl;
                    userinfo.user.name = body === null || body === void 0 ? void 0 : body.displayName;
                    userinfo.user.google = true;
                    break;
                case "apple" || "Apple":
                    userinfo.user.username = body.email.split(regexemail)[0];
                    userinfo.user.email = body.email;
                    userinfo.user.appleID = true;
                    break;
                case "facebook" || "Facebook":
                    userinfo.user.username = body.email.split(regexemail)[0];
                    userinfo.user.email = body.email;
                    userinfo.user.imgURL = body === null || body === void 0 ? void 0 : body.picture.data.url;
                    userinfo.user.name = body === null || body === void 0 ? void 0 : body.name;
                    userinfo.user.facebook = true;
                    break;
                default:
                    (0, returnmodels_1.returnBadReq)(res, { message: "No type was found, use /google, /apple, /facebook" });
                    return;
            }
            const usercol = DatabaseRoutes_1.fsUserCollection.where("email", "==", userinfo.user.email).get();
            if ((yield usercol).size > 0) {
                const data = (yield usercol).docChanges()[0].doc.data();
                const userData = (0, usermodel_1.setUserModel)(data, true);
                userData.token = jsonwebtoken_1.default.sign({ id: userinfo.user.uid }, process.env.SECRET || config_1.default.SECRET, {
                    algorithm: "HS384",
                    expiresIn: "30 days",
                    jwtid: (userinfo.user.uid + "-" + userinfo.user.email)
                });
                console.log(userData);
                (0, returnmodels_1.returnOK)(res, userData);
                return;
            }
            const data = DatabaseRoutes_1.fsUserCollection.doc(userinfo.user.uid);
            userinfo.token = jsonwebtoken_1.default.sign({ id: userinfo.user.uid }, process.env.SECRET || config_1.default.SECRET, {
                algorithm: "HS384",
                expiresIn: "30 days",
                jwtid: (userinfo.user.uid + "-" + userinfo.user.email)
            });
            data.set(userinfo.user).then((v) => {
                const final = (0, usermodel_1.setUserModel)(userinfo.user, true);
                final.token = userinfo.token;
                final.message = "Register complete";
                final.user.online = true;
                (0, returnmodels_1.returnOK)(res, final);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.signUpExt = signUpExt;
function loginExt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const date = firestore_1.Timestamp.now();
        const userinfo = (0, usermodel_1.setUserModel)();
        userinfo.user.dateCreate = date;
        userinfo.user.dateUpdate = date;
        userinfo.user.verifyAccount = true;
        try {
            switch (req.params.type) {
                case "google" || "Google":
                    userinfo.user.email = body.email;
                    userinfo.user.imgURL = body === null || body === void 0 ? void 0 : body.photoUrl;
                    userinfo.user.name = body === null || body === void 0 ? void 0 : body.displayName;
                    break;
                case "apple" || "Apple":
                    break;
                case "facebook" || "Facebook":
                    userinfo.user.email = body.email;
                    userinfo.user.imgURL = body === null || body === void 0 ? void 0 : body.picture.data.url;
                    userinfo.user.username = body === null || body === void 0 ? void 0 : body.name;
                    break;
                default:
                    (0, returnmodels_1.returnBadReq)(res, { message: "No type was found, use /google, /apple, /facebook" });
                    return;
            }
        }
        catch (err) {
            (0, returnmodels_1.returnServerError)(res, err);
        }
    });
}
exports.loginExt = loginExt;
function prepareSMS(uid, callbak) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = (0, verifySMS_1.verifySMS)();
        const user = yield DatabaseRoutes_1.fsUserCollection.doc(uid).get();
        const data = user.data();
        if (user.exists) {
            yield config_database_1.fsRoot.collection("verifySMS").doc(uid).set({
                "sms": code
            }).then((res) => {
                console.log(res);
                sendEmailSMS(data === null || data === void 0 ? void 0 : data.email, code);
                configProxys_1.apiMedia.post('/removeSMS', { id: uid }).then(response => { }).catch(error => console.log(error.message));
                callbak(true);
            }).catch((err) => {
                console.log(err);
                callbak(false);
            });
        }
    });
}
function smsResender(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid;
            const user = yield DatabaseRoutes_1.fsUserCollection.doc(uid).get();
            const data = user.data();
            if (user.exists) {
                yield prepareSMS(uid, (val) => {
                    (0, returnmodels_1.returnOK)(res, { message: "Mensaje enviado" });
                });
            }
            else {
                (0, returnmodels_1.returnNotFound)(res, { message: "usuario no encontrado" });
            }
        }
        catch (err) {
            console.log(err);
            (0, returnmodels_1.returnBadReq)(res, err);
        }
    });
}
exports.smsResender = smsResender;
function validateSMS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = req.body.uid;
        const sms = req.body.sms.toString();
        try {
            const root = config_database_1.fsRoot.collection("verifySMS").doc(uid);
            const obj = yield root.get();
            const user = DatabaseRoutes_1.fsUserCollection.doc(uid);
            if (obj.exists == true) {
                const data = obj.data();
                if ((data === null || data === void 0 ? void 0 : data.sms) == sms) {
                    if ((yield user.get()).exists) {
                        user.update({
                            verifyAccount: true
                        });
                    }
                    else {
                        root.delete();
                        (0, returnmodels_1.returnNotFound)(res, { message: "user Not found" });
                        return;
                    }
                    root.delete();
                    (0, returnmodels_1.returnOK)(res, { message: "Account verify." });
                }
                else {
                    (0, returnmodels_1.returnBadReq)(res, { message: "Code Error" });
                }
            }
            else {
                (0, returnmodels_1.returnBadReq)(res, { message: "code expired" });
            }
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
            return;
        }
    });
}
exports.validateSMS = validateSMS;
function removeSMS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid;
            const verify = config_database_1.fsRoot.collection("verifySMS").doc(uid);
            if ((yield verify.get()).exists) {
                verify.delete();
                console.log("SMS code expired");
            }
            res.status(200).json({ message: 'Proxy ok.' });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.removeSMS = removeSMS;
function sendEmailSMS(email, code) {
    let data = {
        asunto: "Welcome to Baloo , confirm your email to finish register.",
        mail: email,
        message: `<b>Hello your SMS confirmation is ${code}</b> <br> 

      <b> If you didn’t ask to verify this address, you can ignore this email.</b> 
      <br> 
  
      <b> Thanks, - Baloo team </b> 
      `
    };
    configProxys_1.apiMail.post('/sendEmail', data).then(response => { }).catch(error => console.log(error.message));
}
function resetPassword(req, res) {
    const auth = (0, auth_1.getAuth)();
    const email = req.body.email;
    (0, auth_1.sendPasswordResetEmail)(auth, email)
        .then(() => {
        console.log('send email to: ' + email);
        return res.status(200).json({ message: "Email send." });
    })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, " ", errorMessage);
        return res.status(400).json({ message: error.message });
    });
}
exports.resetPassword = resetPassword;
function updatePasswordUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = (0, auth_1.getAuth)();
        const a = auth.currentUser;
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        (0, auth_1.updatePassword)(a, newPassword).then(() => {
        }).catch((error) => {
            console.log(error);
            console.error(error.message);
        });
    });
}
exports.updatePasswordUser = updatePasswordUser;
//# sourceMappingURL=index.controllers.js.map