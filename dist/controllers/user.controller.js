"use strict";
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
exports.verifyUserExist = exports.clearDataUser = exports.deleteUser = exports.profileImage = exports.searchUSerByUserName = exports.searchUserByID = exports.updateUserFirebase = exports.getUsersFirebase = exports.getAllUsers = void 0;
const database_1 = require("firebase/database");
const auth_1 = require("firebase/auth");
const validateImages_1 = require("../libs/validateImages");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const usermodel_1 = require("../models/usermodel");
const returnmodels_1 = require("../models/returnmodels");
const firestore_1 = require("firebase-admin/firestore");
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userCollection = yield DatabaseRoutes_1.fsUserCollection.get();
            var final = [];
            userCollection.forEach((v) => {
                var user = (0, usermodel_1.setUserModel)(v.data(), true).user;
                final.push(user);
            });
            (0, returnmodels_1.returnOK)(res, final);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getAllUsers = getAllUsers;
function getUsersFirebase(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid;
            const token = req.body.token;
            const userDoc = yield DatabaseRoutes_1.fsUserCollection.doc(uid);
            if (!(yield userDoc.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, "usuario no encontrado");
                return;
            }
            const userData = (yield userDoc.get());
            const userAnimals = yield DatabaseRoutes_1.fsAnimalCollection.where("uid", "==", uid).get();
            const userServices = yield DatabaseRoutes_1.fsServicesCollection.where("uid", "==", uid).get();
            var data = userData.data();
            data = (0, usermodel_1.setUserModel)(data, true);
            data.user.uid = uid;
            data.user = Object.assign(Object.assign({}, data.user), { animalCount: userAnimals.size, servicesCount: userServices.size });
            (0, returnmodels_1.returnOK)(res, data);
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getUsersFirebase = getUsersFirebase;
function updateUserFirebase(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = req.files;
        const token = req.body.token;
        var dateNow = Date.now();
        try {
            const arrayImages = yield (0, validateImages_1.getIMGURL)(paths);
            const userData = (0, usermodel_1.setUserModel)(req.body).user;
            const userDoc = DatabaseRoutes_1.fsUserCollection.doc(userData.uid);
            userData.imgURL = arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"];
            delete userData.email;
            delete userData.username;
            delete userData.online;
            delete userData.verifyAccount;
            if ((yield userDoc.get()).exists) {
                userData.dateUpdate = firestore_1.Timestamp.now();
                userDoc.update(userData).then((val) => __awaiter(this, void 0, void 0, function* () {
                    const u = (yield userDoc.get()).data();
                    const data = (0, usermodel_1.setUserModel)(u, true);
                    data.message = "usuario actualizado";
                    (0, returnmodels_1.returnOK)(res, data);
                })).catch((err) => {
                    (0, returnmodels_1.returnBadReq)(res, err);
                });
            }
            else {
                (0, returnmodels_1.returnNotFound)(res, "Usuario no encontrado");
            }
        }
        catch (error) {
            (0, returnmodels_1.returnBadReq)(res, error);
        }
    });
}
exports.updateUserFirebase = updateUserFirebase;
function searchUserByID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const username = req.body.username;
            const token = req.body.token;
            const r = (0, database_1.ref)(dbs, `userPerfilDates/`);
            const db = (0, database_1.getDatabase)();
            const auth = (0, auth_1.getAuth)();
            const list = (0, database_1.query)(r, ...[(0, database_1.orderByChild)('username'), (0, database_1.equalTo)(`${username}`)]);
            (0, database_1.get)(list).then((response) => {
                var data = response.val();
                if (data == null) {
                    data = {};
                    return res.status(200).json({ user: data });
                }
            });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            return res.status(500).json(error.message);
        }
    });
}
exports.searchUserByID = searchUserByID;
function searchUSerByUserName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const username = req.body.username;
            const token = req.body.token;
            const r = (0, database_1.ref)(dbs, `userPerfilDates/`);
            const db = (0, database_1.getDatabase)();
            const auth = (0, auth_1.getAuth)();
            const list = (0, database_1.query)(r, ...[(0, database_1.orderByChild)('username'), (0, database_1.equalTo)(`${username}`)]);
            (0, database_1.get)(list).then((response) => {
                var data = response.val();
                if (data == null) {
                    data = {};
                    return res.status(200).json({ user: data });
                }
            });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            return res.status(500).json(error.message);
        }
    });
}
exports.searchUSerByUserName = searchUSerByUserName;
function profileImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paths = req.files;
            const uid = req.body.uid;
            let arrayImages = yield (0, validateImages_1.getIMGURL)(paths);
            const user = DatabaseRoutes_1.fsUserCollection.doc(uid);
            if ((yield user.get()).exists) {
                user.update({
                    imgURL: arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"]
                }).then((val) => {
                    const user = {
                        imgURL: arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"]
                    };
                    (0, returnmodels_1.returnOK)(res, { user });
                }).catch((err) => {
                    (0, returnmodels_1.returnBadReq)(res, err);
                });
            }
            else {
                (0, returnmodels_1.returnNotFound)(res, "Usuario no encontrado");
            }
        }
        catch (e) {
            (0, returnmodels_1.returnServerError)(res, e);
        }
    });
}
exports.profileImage = profileImage;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = req.body.uid;
        if (!(yield verifyUserExist(uid, res))) {
            return;
        }
        const userData = DatabaseRoutes_1.fsUserCollection.doc(uid);
        userData.update({
            "deleted": true
        }).catch((err) => {
            (0, returnmodels_1.returnBadReq)(res, err);
        }).then((v) => {
            (0, returnmodels_1.returnOK)(res, {});
        });
    });
}
exports.deleteUser = deleteUser;
function clearDataUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid;
            if (!(yield verifyUserExist(uid, res))) {
                return;
            }
            const userData = DatabaseRoutes_1.fsUserCollection.doc(uid);
            const userStorys = yield DatabaseRoutes_1.fsStoryCollection.where("uid", "==", uid).get();
            const userServices = yield DatabaseRoutes_1.fsServicesCollection.where("uid", "==", uid).get();
            const userAnimals = yield DatabaseRoutes_1.fsAnimalCollection.where("uid", "==", uid).get();
            const data = yield userData.get();
            userAnimals.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    var aid = val.data().aid;
                    var animal = yield DatabaseRoutes_1.fsAnimalCollection.doc(aid).delete();
                    console.log(`- User ${uid} Animals  clear.`);
                }
                else {
                    null;
                }
            }));
            userStorys.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    console.log(val.data());
                }
                else {
                    null;
                }
                console.log(`- User ${uid} Storys  clear.`);
            }));
            userServices.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    var sid = val.data().sid;
                    var service = yield DatabaseRoutes_1.fsServicesCollection.doc(sid).delete();
                    console.log(`- User ${uid} Services  clear.`);
                }
                else {
                    null;
                }
            }));
            (0, returnmodels_1.returnOK)(res, { message: "data user clear." });
        }
        catch (e) {
            (0, returnmodels_1.returnServerError)(res, e);
        }
    });
}
exports.clearDataUser = clearDataUser;
function verifyUserExist(uid, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userdoc = DatabaseRoutes_1.fsUserCollection.doc(uid);
            if (!(yield userdoc.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, { message: "User Not found" });
                return false;
            }
            return true;
        }
        catch (error) {
            (0, returnmodels_1.returnBadReq)(res, error);
            return false;
        }
    });
}
exports.verifyUserExist = verifyUserExist;
//# sourceMappingURL=user.controller.js.map