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
exports.getProfileDataData = exports.getProfileData = exports.timestampToDate = exports.sortFullDataAnimal = exports.profileDefaultIMG = void 0;
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const animalmodel_1 = require("../models/animalmodel");
const returnmodels_1 = require("../models/returnmodels");
const servicemodel_1 = require("../models/servicemodel");
exports.profileDefaultIMG = "http://app.baloo.pet/uploads/peopleicon.jpeg";
function sortFullDataAnimal(data) {
    try {
        var followers = [];
        var following = [];
        for (let key in data.followers) {
            followers = [...followers, key];
        }
        for (let key in data.following) {
            following = [...following, key];
        }
        const fullData = {
            "adq": data.adq,
            "age": data.age,
            "aid": data.aid,
            "date": data.date,
            "description": data.description,
            "followers": followers,
            "following": following,
            "health_details": data.health_details,
            "match_search": data.match_search,
            "medicalRecords": data.medicalRecords,
            "name": data.name,
            "origin_father": data.origin_father,
            "origin_mother": data.origin_mother,
            "path": data.path,
            "path_pedigree": data.path_pedigree,
            "pedigree": data.pedigree,
            "race": data.race,
            "rol": data.rol,
            "sex": data.sex,
            "species": data.species,
            "uid": data.uid,
            "url": data.url,
            "username": data.username
        };
        return fullData;
    }
    catch (e) {
        console.log(Date());
        console.log(e.message);
    }
}
exports.sortFullDataAnimal = sortFullDataAnimal;
function timestampToDate(obj) {
    var time;
    try {
        time = new firestore_1.Timestamp(obj._seconds, obj._nanoseconds).toDate();
    }
    catch (error) {
        time = undefined;
    }
    return time;
}
exports.timestampToDate = timestampToDate;
function getProfileData(profileID) {
    if (profileID.includes("A-") && profileID != undefined) {
        return DatabaseRoutes_1.fsAnimalCollection.doc(profileID);
    }
    if (profileID.includes("S-") && profileID != undefined) {
        return DatabaseRoutes_1.fsServicesCollection.doc(profileID);
    }
}
exports.getProfileData = getProfileData;
function getProfileDataData(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const model = (datos) => {
            const mydata = {
                "profileID": datos.serviceID || datos.sid || (datos === null || datos === void 0 ? void 0 : datos.aid),
                "name": datos.businessName || datos.name,
                "imgProfile": datos.imgUrl || (datos === null || datos === void 0 ? void 0 : datos.imgProfile) || exports.profileDefaultIMG,
            };
            return mydata;
        };
        const pid = req.body.profileID;
        if (!pid || pid == "") {
            (0, returnmodels_1.returnBadReq)(res, { message: "Error ProfileID not Found" });
            return;
        }
        const profileDoc = yield getProfileData(pid);
        if (!((_a = (yield (profileDoc === null || profileDoc === void 0 ? void 0 : profileDoc.get()))) === null || _a === void 0 ? void 0 : _a.exists)) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Profile ID Not Found" });
            return;
        }
        if (pid.includes("A-")) {
            const data = (0, animalmodel_1.setAnimalModelToReturn)((_b = (yield (profileDoc === null || profileDoc === void 0 ? void 0 : profileDoc.get()))) === null || _b === void 0 ? void 0 : _b.data()).animal;
            (0, returnmodels_1.returnOK)(res, model(data));
            return;
        }
        if (pid.includes("S-")) {
            const data = (0, servicemodel_1.setServiceModel)((_c = (yield (profileDoc === null || profileDoc === void 0 ? void 0 : profileDoc.get()))) === null || _c === void 0 ? void 0 : _c.data(), true);
            (0, returnmodels_1.returnOK)(res, model(data));
            return;
        }
    });
}
exports.getProfileDataData = getProfileDataData;
//# sourceMappingURL=functions.js.map