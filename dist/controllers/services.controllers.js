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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceFollowersDocument = exports.getServiceFollowingDocument = exports.verifyServiceExist = exports.getServiceByUserId = exports.deleteService = exports.updateService = exports.getService = exports.getServiceList = exports.createService = void 0;
const auth_1 = require("firebase/auth");
const database_1 = require("firebase/database");
const uniqid_1 = __importDefault(require("uniqid"));
const validateImages_1 = require("../libs/validateImages");
const returnmodels_1 = require("../models/returnmodels");
const servicemodel_1 = require("../models/servicemodel");
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const user_controller_1 = require("./user.controller");
function createService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth = (0, auth_1.getAuth)();
            const serviceID = (0, uniqid_1.default)('S-');
            const paths = req.files;
            var dateNow = firestore_1.Timestamp.now();
            var arrayImages = yield (0, validateImages_1.getIMGURL)(paths);
            const profile = (0, servicemodel_1.setServiceModel)(req.body);
            profile.sid = serviceID;
            profile.imgProfile = arrayImages["imgProfile"];
            profile.dateCreated = profile.dateUpdated = dateNow;
            const final = (0, servicemodel_1.setServiceModel)(profile, true);
            DatabaseRoutes_1.fsServicesCollection.doc(serviceID).set(final).catch((err) => {
                (0, returnmodels_1.returnConflict)(res, err);
            }).then((resp) => {
                (0, returnmodels_1.returnOK)(res, final);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.createService = createService;
function getServiceList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var serviceList = [];
            (yield DatabaseRoutes_1.fsServicesCollection.get()).docs.map((services) => {
                const service = (0, servicemodel_1.setServiceModel)(services.data(), true);
                serviceList.push(service);
            });
            (0, returnmodels_1.returnOK)(res, serviceList);
        }
        catch (err) {
            (0, returnmodels_1.returnServerError)(res, err);
        }
    });
}
exports.getServiceList = getServiceList;
function getService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth = (0, auth_1.getAuth)();
            const servicesCollection = DatabaseRoutes_1.fsServicesCollection.doc(req.body.sid);
            if (!(yield servicesCollection.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, { message: "profile not found" });
                return;
            }
            yield servicesCollection.get().catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((value) => {
                const data = (0, servicemodel_1.setServiceModel)(value.data(), true);
                (0, returnmodels_1.returnOK)(res, data);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getService = getService;
function updateService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth = (0, auth_1.getAuth)();
            const dbs = (0, database_1.getDatabase)();
            var profileInput = (0, servicemodel_1.setServiceModel)(req.body);
            var arrayImages = yield (0, validateImages_1.getIMGURL)(req.files);
            const servicesCollection = DatabaseRoutes_1.fsServicesCollection.doc(profileInput.sid);
            if (!(yield servicesCollection.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, { message: "Profile not found" });
                return;
            }
            profileInput.dateUpdated = firestore_1.Timestamp.now();
            profileInput.imgProfile = arrayImages["imgProfile"];
            servicesCollection.update(profileInput).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, (0, servicemodel_1.setServiceModel)(profileInput, true));
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.updateService = updateService;
function deleteService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serviceDoc = DatabaseRoutes_1.fsServicesCollection.doc(req.body.sid);
            if (!(yield serviceDoc.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, { message: "Profile not found" });
                return;
            }
            const profileData = (0, servicemodel_1.setServiceModel)(req.body);
            profileData.deleted = true;
            profileData.dateUpdated = firestore_1.Timestamp.now();
            serviceDoc.update(profileData).catch((err) => {
                (0, returnmodels_1.returnServerError)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, {});
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.deleteService = deleteService;
function getServiceByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid || req.params.uid;
            var showdel = req.body.all;
            if (!(yield (0, user_controller_1.verifyUserExist)(uid, res))) {
                return;
            }
            const servicesCollectionQuery = DatabaseRoutes_1.fsServicesCollection.where("uid", "==", uid);
            const data = (yield servicesCollectionQuery.get()).docs;
            var final = [];
            data.forEach((d) => {
                var serviceData = (0, servicemodel_1.setServiceModel)(d.data(), true);
                if (!showdel) {
                    if (serviceData.deleted == false || serviceData.deleted == undefined) {
                        final.push(serviceData);
                    }
                }
                if (showdel) {
                    final.push(serviceData);
                }
            });
            (0, returnmodels_1.returnOK)(res, final);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getServiceByUserId = getServiceByUserId;
function verifyServiceExist(sid, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceDoc = DatabaseRoutes_1.fsServicesCollection.doc(sid);
        if (!(yield serviceDoc.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Service Not found" });
            return false;
        }
        return true;
    });
}
exports.verifyServiceExist = verifyServiceExist;
function getServiceFollowingDocument(sid) {
    return DatabaseRoutes_1.fsServicesCollection.doc(sid).collection("followList").doc("following");
}
exports.getServiceFollowingDocument = getServiceFollowingDocument;
function getServiceFollowersDocument(sid) {
    return DatabaseRoutes_1.fsServicesCollection.doc(sid).collection("followList").doc("followers");
}
exports.getServiceFollowersDocument = getServiceFollowersDocument;
//# sourceMappingURL=services.controllers.js.map