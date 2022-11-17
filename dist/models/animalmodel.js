"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAnimalModelToReturn = exports.setAnimalModel = void 0;
const functions_1 = require("../libs/functions");
const match_model_1 = require("./match.model");
function setAnimalModel(data) {
    var _a, _b, _c, _d;
    var pedigree = (_a = data === null || data === void 0 ? void 0 : data.pedigree) !== null && _a !== void 0 ? _a : (_b = data === null || data === void 0 ? void 0 : data.animal) === null || _b === void 0 ? void 0 : _b.pedigree;
    var match_search = (_c = data === null || data === void 0 ? void 0 : data.match_search) !== null && _c !== void 0 ? _c : (_d = data === null || data === void 0 ? void 0 : data.animal) === null || _d === void 0 ? void 0 : _d.match_search;
    if (typeof (pedigree) == "string") {
        if (pedigree == "true") {
            pedigree = true;
        }
        else {
            pedigree = false;
        }
    }
    if (typeof (match_search) == "string") {
        if (match_search == "true") {
            match_search = true;
        }
        else {
            match_search = false;
        }
    }
    const myanimal = {
        animal: {
            "aid": data === null || data === void 0 ? void 0 : data.aid,
            "imgProfile": (data === null || data === void 0 ? void 0 : data.imgProfile) || "",
            "username": data === null || data === void 0 ? void 0 : data.username,
            "name": data === null || data === void 0 ? void 0 : data.name,
            "race": data === null || data === void 0 ? void 0 : data.race,
            "sex": data === null || data === void 0 ? void 0 : data.sex,
            "age": data === null || data === void 0 ? void 0 : data.age,
            "place": data === null || data === void 0 ? void 0 : data.place,
            "health_details": data === null || data === void 0 ? void 0 : data.health_details,
            "origin_father": data === null || data === void 0 ? void 0 : data.origin_father,
            "origin_mother": data === null || data === void 0 ? void 0 : data.origin_mother,
            "pedigreeFile": (data === null || data === void 0 ? void 0 : data.pedigreeFile) || "",
            "pedigree": pedigree,
            "species": data === null || data === void 0 ? void 0 : data.species,
            "description": data === null || data === void 0 ? void 0 : data.description,
            "match_search": match_search,
            "adq": data === null || data === void 0 ? void 0 : data.adq,
            "rol": data === null || data === void 0 ? void 0 : data.rol,
            "uid": data === null || data === void 0 ? void 0 : data.uid,
            "following": (data === null || data === void 0 ? void 0 : data.following) || [],
            "followers": (data === null || data === void 0 ? void 0 : data.followers) || [],
            "matchs": (0, match_model_1.setNewAnimalMatchModel)(),
            "deleted": (data === null || data === void 0 ? void 0 : data.deleted) || undefined,
            "disabled": (data === null || data === void 0 ? void 0 : data.disable) || undefined,
            "dateCreate": (data === null || data === void 0 ? void 0 : data.dateC) || (data === null || data === void 0 ? void 0 : data.dateCreate),
            "dateUpdated": (data === null || data === void 0 ? void 0 : data.dateU) || (data === null || data === void 0 ? void 0 : data.dateUpdated)
        },
        message: ""
    };
    return myanimal;
}
exports.setAnimalModel = setAnimalModel;
function setAnimalModelToReturn(data) {
    var myanimal = setAnimalModel((data === null || data === void 0 ? void 0 : data.animal) || data);
    myanimal.animal.dateCreate = (0, functions_1.timestampToDate)(myanimal.animal.dateCreate);
    myanimal.animal.dateUpdated = (0, functions_1.timestampToDate)(myanimal.animal.dateUpdated);
    for (const key in myanimal.animal) {
        if (myanimal.animal[key] == undefined) {
            myanimal.animal[key] = "";
        }
    }
    if (myanimal.animal.imgProfile == "") {
        myanimal.animal.imgProfile = functions_1.profileDefaultIMG;
    }
    return myanimal;
}
exports.setAnimalModelToReturn = setAnimalModelToReturn;
//# sourceMappingURL=animalmodel.js.map