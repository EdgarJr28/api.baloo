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
exports.getFollersFromProfileDocument = exports.getFollowingsFromProfileDocument = exports.setfollow = void 0;
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const functions_1 = require("../libs/functions");
const followmodel_1 = require("../models/followmodel");
const returnmodels_1 = require("../models/returnmodels");
const animals_controllers_1 = require("./animals.controllers");
const services_controllers_1 = require("./services.controllers");
function setfollow(req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const hostID = body.hostID;
        const clientID = body.clientID;
        var dataHost = undefined;
        var dataClient = undefined;
        var dataHostFollowingDoc = undefined;
        var dataClientFollowedDoc = undefined;
        if (hostID.includes("A-")) {
            if (hostID != undefined && !(yield (0, animals_controllers_1.verifyAnimalExist)(hostID, res))) {
                return;
            }
            dataHost = DatabaseRoutes_1.fsAnimalCollection.doc(hostID);
            dataHostFollowingDoc = (0, animals_controllers_1.getAnimalFollowingDocument)(hostID);
        }
        if (hostID.includes("S-")) {
            if (hostID != undefined && !(yield (0, services_controllers_1.verifyServiceExist)(hostID, res))) {
                return;
            }
            dataHost = DatabaseRoutes_1.fsServicesCollection.doc(hostID);
            dataHostFollowingDoc = (0, services_controllers_1.getServiceFollowingDocument)(hostID);
        }
        if (clientID.includes("A-")) {
            if (clientID != undefined && !(yield (0, animals_controllers_1.verifyAnimalExist)(clientID, res))) {
                return;
            }
            dataClient = DatabaseRoutes_1.fsAnimalCollection.doc(clientID);
            dataClientFollowedDoc = (0, animals_controllers_1.getAnimalFollowersDocument)(clientID);
        }
        if (clientID.includes("S-")) {
            if (clientID != undefined && !(yield (0, services_controllers_1.verifyServiceExist)(clientID, res))) {
                return;
            }
            dataClient = DatabaseRoutes_1.fsServicesCollection.doc(clientID);
            dataClientFollowedDoc = (0, services_controllers_1.getServiceFollowersDocument)(clientID);
        }
        var date = firestore_1.Timestamp.now();
        var tohost = (0, followmodel_1.setFollowModel)(clientID, date, "", (_a = (yield (dataClient === null || dataClient === void 0 ? void 0 : dataClient.get()))) === null || _a === void 0 ? void 0 : _a.data(), true);
        var toclient = (0, followmodel_1.setFollowModel)(hostID, date, "", (_b = (yield (dataHost === null || dataHost === void 0 ? void 0 : dataHost.get()))) === null || _b === void 0 ? void 0 : _b.data(), true);
        var clientFollowData = (_c = (yield (dataClientFollowedDoc === null || dataClientFollowedDoc === void 0 ? void 0 : dataClientFollowedDoc.get()))) === null || _c === void 0 ? void 0 : _c.data();
        var hostFollowData = (_d = (yield (dataHostFollowingDoc === null || dataHostFollowingDoc === void 0 ? void 0 : dataHostFollowingDoc.get()))) === null || _d === void 0 ? void 0 : _d.data();
        try {
            if (clientFollowData == undefined) {
                yield (dataClientFollowedDoc === null || dataClientFollowedDoc === void 0 ? void 0 : dataClientFollowedDoc.set(toclient));
                toclient[hostID].status = "following";
                console.log("create id");
            }
            else {
                if (clientFollowData[hostID] == undefined) {
                    console.log("update id");
                    yield (dataClientFollowedDoc === null || dataClientFollowedDoc === void 0 ? void 0 : dataClientFollowedDoc.update(toclient));
                    toclient[hostID].status = "following";
                }
                else {
                    console.log("eliminar id");
                    yield (dataClientFollowedDoc === null || dataClientFollowedDoc === void 0 ? void 0 : dataClientFollowedDoc.delete({
                        [hostID]: firestore_1.FieldValue.delete()
                    }));
                    toclient[hostID].status = "deleted";
                }
            }
            if (hostFollowData == undefined) {
                yield (dataHostFollowingDoc === null || dataHostFollowingDoc === void 0 ? void 0 : dataHostFollowingDoc.set(tohost));
                tohost[clientID].status = "following";
                console.log("create id");
            }
            else {
                if (hostFollowData[clientID] == undefined) {
                    console.log("update id");
                    yield (dataHostFollowingDoc === null || dataHostFollowingDoc === void 0 ? void 0 : dataHostFollowingDoc.update(tohost));
                    tohost[clientID].status = "following";
                }
                else {
                    console.log("eliminar id");
                    yield (dataHostFollowingDoc === null || dataHostFollowingDoc === void 0 ? void 0 : dataHostFollowingDoc.delete({
                        [clientID]: firestore_1.FieldValue.delete()
                    }));
                    tohost[clientID].status = "deleted";
                }
            }
            (0, returnmodels_1.returnOK)(res, tohost[clientID]);
        }
        catch (error) {
            (0, returnmodels_1.returnBadReq)(res, error);
        }
    });
}
exports.setfollow = setfollow;
function getFollowingsFromProfileDocument(profileID) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return (_a = (yield (0, functions_1.getProfileData)(profileID))) === null || _a === void 0 ? void 0 : _a.collection("followList").doc("following");
    });
}
exports.getFollowingsFromProfileDocument = getFollowingsFromProfileDocument;
function getFollersFromProfileDocument(profileID) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return (_a = (yield (0, functions_1.getProfileData)(profileID))) === null || _a === void 0 ? void 0 : _a.collection("followList").doc("followers");
    });
}
exports.getFollersFromProfileDocument = getFollersFromProfileDocument;
//# sourceMappingURL=follow.js.map