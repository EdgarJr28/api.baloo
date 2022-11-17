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
exports.convertDocToArray = exports.getFullMatchList = exports.setNewAnimalMatchModel = exports.setFollowModelWithTime = exports.setMatchModel = void 0;
const matchs_controller_1 = require("../controllers/matchs.controller");
const functions_1 = require("../libs/functions");
const animals_controllers_1 = require("../controllers/animals.controllers");
function setMatchModel(aid, status, animal, date, tofront) {
    var _a, _b;
    var dataMatch = {
        [aid]: {
            aid: aid,
            name: (animal === null || animal === void 0 ? void 0 : animal.name) || ((_a = animal === null || animal === void 0 ? void 0 : animal.animal) === null || _a === void 0 ? void 0 : _a.name) || "",
            imgProfile: (animal === null || animal === void 0 ? void 0 : animal.imgProfile) || ((_b = animal === null || animal === void 0 ? void 0 : animal.animal) === null || _b === void 0 ? void 0 : _b.imgProfile) || (animal === null || animal === void 0 ? void 0 : animal.imgUrl) || "",
            status: status,
            date: date
        }
    };
    return dataMatch;
}
exports.setMatchModel = setMatchModel;
function setFollowModelWithTime(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const animaldata = yield (0, animals_controllers_1.getAnimalByID)(obj.aid, () => { }, () => { }, true);
        var myfollow = setMatchModel(obj.aid, obj.date, obj.status, animaldata);
        myfollow[obj.aid].date = (0, functions_1.timestampToDate)(myfollow[obj.aid].date);
        return myfollow;
    });
}
exports.setFollowModelWithTime = setFollowModelWithTime;
function setNewAnimalMatchModel() {
    var dataMatch = {
        match_request: {},
        match_sended: {}
    };
    return dataMatch;
}
exports.setNewAnimalMatchModel = setNewAnimalMatchModel;
function getFullMatchList(aid, array) {
    return __awaiter(this, void 0, void 0, function* () {
        const followersDoc = (yield (0, matchs_controller_1.getMatchSendedDocument)(aid).get()).data();
        const followingDoc = (yield (0, matchs_controller_1.getMatchRequestDocument)(aid).get()).data();
        var ret = {
            "match_sended": !array ? followersDoc : yield convertDocToArray(followersDoc),
            "match_request": !array ? followingDoc : yield convertDocToArray(followingDoc)
        };
        return ret;
    });
}
exports.getFullMatchList = getFullMatchList;
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
//# sourceMappingURL=match.model.js.map