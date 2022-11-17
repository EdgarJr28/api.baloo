"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPublicityModel = void 0;
const functions_1 = require("../libs/functions");
function setPublicityModel(data, tofront) {
    var _a, _b;
    const mydata = {
        "pubid": data === null || data === void 0 ? void 0 : data.pubid,
        "profileID": data === null || data === void 0 ? void 0 : data.profileID,
        "title": data === null || data === void 0 ? void 0 : data.title,
        "multimedia": data === null || data === void 0 ? void 0 : data.multimedia,
        "text": data === null || data === void 0 ? void 0 : data.text,
        "dateCreated": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateCreated) : data === null || data === void 0 ? void 0 : data.dateCreated,
        "user": {
            "name": ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.name) || "",
            "imgProfile": ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.imgProfile) || functions_1.profileDefaultIMG
        }
    };
    return mydata;
}
exports.setPublicityModel = setPublicityModel;
//# sourceMappingURL=publicityModel.js.map