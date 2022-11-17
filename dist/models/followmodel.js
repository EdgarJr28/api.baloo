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
exports.convertDocToArray = exports.getFullFollowList = exports.getAnimalsFollowingDoc = exports.getAnimalsFollowersDoc = exports.setFollowModelWithTime = exports.setFollowModel = void 0;
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const animals_controllers_1 = require("../controllers/animals.controllers");
const functions_1 = require("../libs/functions");
function setFollowModel(id, date, status, animal, tofront) {
    var _a, _b;
    var myfollow = {
        [id]: {
            "aid": id,
            "name": (animal === null || animal === void 0 ? void 0 : animal.name) || ((_a = animal === null || animal === void 0 ? void 0 : animal.animal) === null || _a === void 0 ? void 0 : _a.name) || "",
            "imgProfile": (animal === null || animal === void 0 ? void 0 : animal.imgProfile) || ((_b = animal === null || animal === void 0 ? void 0 : animal.animal) === null || _b === void 0 ? void 0 : _b.imgProfile) || (animal === null || animal === void 0 ? void 0 : animal.imgUrl) || "",
            "date": date,
            "status": status
        }
    };
    if (tofront) {
        myfollow[id].date = (0, functions_1.timestampToDate)(myfollow[id].date);
    }
    return myfollow;
}
exports.setFollowModel = setFollowModel;
function setFollowModelWithTime(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const animaldata = yield (0, animals_controllers_1.getAnimalByID)(obj.aid, () => { }, () => { }, true);
        var myfollow = setFollowModel(obj.aid, obj.date, obj.status, animaldata);
        myfollow[obj.aid].date = (0, functions_1.timestampToDate)(myfollow[obj.aid].date);
        return myfollow;
    });
}
exports.setFollowModelWithTime = setFollowModelWithTime;
function getAnimalsFollowersDoc(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("followList").doc("followers");
}
exports.getAnimalsFollowersDoc = getAnimalsFollowersDoc;
function getAnimalsFollowingDoc(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("followList").doc("following");
}
exports.getAnimalsFollowingDoc = getAnimalsFollowingDoc;
function getFullFollowList(aid, array) {
    return __awaiter(this, void 0, void 0, function* () {
        const followersDoc = (yield getAnimalsFollowersDoc(aid).get()).data();
        const followingDoc = (yield getAnimalsFollowingDoc(aid).get()).data();
        var ret = {
            "followers": !array ? followersDoc : yield convertDocToArray(followersDoc),
            "following": !array ? followingDoc : yield convertDocToArray(followingDoc)
        };
        return ret;
    });
}
exports.getFullFollowList = getFullFollowList;
function convertDocToArray(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var array = [];
        for (const key in obj) {
            var data = yield setFollowModelWithTime(obj[key]);
            array.push(data[key]);
        }
        return array;
    });
}
exports.convertDocToArray = convertDocToArray;
//# sourceMappingURL=followmodel.js.map