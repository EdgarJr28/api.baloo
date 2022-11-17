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
exports.setPostModel = void 0;
const functions_1 = require("../libs/functions");
function setPostModel(data, tofront, aData) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let uData = {
            "index": data === null || data === void 0 ? void 0 : data.index,
            "text": data === null || data === void 0 ? void 0 : data.text,
            "profileID": (data === null || data === void 0 ? void 0 : data.profileID) || (data === null || data === void 0 ? void 0 : data.aid) || (data === null || data === void 0 ? void 0 : data.sid),
            "pubid": data === null || data === void 0 ? void 0 : data.pubid,
            "multimedia": (data === null || data === void 0 ? void 0 : data.multimedia) || functions_1.profileDefaultIMG,
            "like": (data === null || data === void 0 ? void 0 : data.like) || [],
            "shared": (data === null || data === void 0 ? void 0 : data.shared) || [],
            "deleted": data === null || data === void 0 ? void 0 : data.deleted,
            "user": {
                "name": ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.name) || (aData === null || aData === void 0 ? void 0 : aData.name) || "",
                "imgProfile": ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.imgProfile) || (aData === null || aData === void 0 ? void 0 : aData.imgProfile) || functions_1.profileDefaultIMG
            },
            "dateCreated": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateCreated) : data === null || data === void 0 ? void 0 : data.dateCreated,
            "dateUpdated": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateUpdated) : data === null || data === void 0 ? void 0 : data.dateUpdated,
            "pid": data === null || data === void 0 ? void 0 : data.pid
        };
        if (tofront) {
            if (!uData.like) {
                uData.like = [];
            }
            if (!uData.shared) {
                uData.shared = [];
            }
            for (const key in uData) {
                (_c = uData[key]) !== null && _c !== void 0 ? _c : delete uData[key];
            }
        }
        return uData;
    });
}
exports.setPostModel = setPostModel;
//# sourceMappingURL=postModel.js.map