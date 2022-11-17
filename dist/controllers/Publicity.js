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
exports.delPubData = exports.publicityListBuilder = exports.getPubList = exports.createPub = void 0;
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const functions_1 = require("../libs/functions");
const validateImages_1 = require("../libs/validateImages");
const publicityModel_1 = require("../models/publicityModel");
const returnmodels_1 = require("../models/returnmodels");
const uid = require("uniqid");
function createPub(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const pubinput = (0, publicityModel_1.setPublicityModel)(req.body);
        const userDoc = (0, functions_1.getProfileData)(pubinput.profileID);
        if (!((_a = (yield (userDoc === null || userDoc === void 0 ? void 0 : userDoc.get()))) === null || _a === void 0 ? void 0 : _a.exists)) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Usuario no encontrado" });
            return;
        }
        const userData = (_c = (yield ((_b = (0, functions_1.getProfileData)(pubinput.profileID)) === null || _b === void 0 ? void 0 : _b.get()))) === null || _c === void 0 ? void 0 : _c.data();
        const multimedia = yield (0, validateImages_1.getIMGURL)(req.files);
        pubinput.pubid = uid("Pub-");
        pubinput.multimedia = multimedia["multimedia"] || pubinput.multimedia;
        pubinput.dateCreated = firestore_1.Timestamp.now();
        pubinput.user.name = userData === null || userData === void 0 ? void 0 : userData.name;
        pubinput.user.imgProfile = userData === null || userData === void 0 ? void 0 : userData.imgProfile;
        const pubDoc = DatabaseRoutes_1.fsPublicityCollection.doc(pubinput.pubid);
        pubDoc.set(pubinput).catch((err) => {
            (0, returnmodels_1.returnServerError)(res, err);
        }).then((v) => {
            const final = (0, publicityModel_1.setPublicityModel)(pubinput, true);
            (0, returnmodels_1.returnOK)(res, final);
        });
    });
}
exports.createPub = createPub;
function getPubList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pubInput = (0, publicityModel_1.setPublicityModel)(req.body);
        var publist = yield publicityListBuilder();
        (0, returnmodels_1.returnOK)(res, publist);
    });
}
exports.getPubList = getPubList;
function publicityListBuilder() {
    return __awaiter(this, void 0, void 0, function* () {
        const pubDoc = (yield DatabaseRoutes_1.fsPublicityCollection.get()).docs;
        var list = [];
        pubDoc.map((v) => {
            var data = (0, publicityModel_1.setPublicityModel)(v.data(), true);
            list.push(data);
        });
        return list;
    });
}
exports.publicityListBuilder = publicityListBuilder;
function delPubData(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pubInput = (0, publicityModel_1.setPublicityModel)(req.body);
            const pubDoc = DatabaseRoutes_1.fsPublicityCollection.doc(pubInput.pubid);
            if (!((_a = (yield pubDoc.get())) === null || _a === void 0 ? void 0 : _a.exists)) {
                (0, returnmodels_1.returnBadReq)(res, { message: "ID no encontrado" });
                return;
            }
            pubDoc.delete().catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, { message: "Publicidad eliminada", });
            });
        }
        catch (error) {
            (0, returnmodels_1.returnBadReq)(res, error);
        }
    });
}
exports.delPubData = delPubData;
//# sourceMappingURL=Publicity.js.map