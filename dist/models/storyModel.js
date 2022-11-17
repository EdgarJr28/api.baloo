"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStoryModel = void 0;
const functions_1 = require("../libs/functions");
function setStoryModel(data, tofront, aData) {
    var _a, _b, _c, _d;
    var story = {
        "stid": data === null || data === void 0 ? void 0 : data.stid,
        "profileID": data === null || data === void 0 ? void 0 : data.profileID,
        "text": (data === null || data === void 0 ? void 0 : data.text) || "",
        "multimedia": data === null || data === void 0 ? void 0 : data.multimedia,
        "preview": data === null || data === void 0 ? void 0 : data.preview,
        "user": {
            "name": (_c = (_a = aData === null || aData === void 0 ? void 0 : aData.name) !== null && _a !== void 0 ? _a : (_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "",
            "imgProfile": (aData === null || aData === void 0 ? void 0 : aData.imgProfile) || ((_d = data === null || data === void 0 ? void 0 : data.user) === null || _d === void 0 ? void 0 : _d.imgProfile) || functions_1.profileDefaultIMG
        },
        "dateCreated": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateCreated) : data === null || data === void 0 ? void 0 : data.dateCreated,
        "dateUpdate": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateUpdate) : data === null || data === void 0 ? void 0 : data.dateUpdate
    };
    return story;
}
exports.setStoryModel = setStoryModel;
//# sourceMappingURL=storyModel.js.map