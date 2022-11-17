"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserModel = void 0;
const functions_1 = require("../libs/functions");
function adminUserModel(data, tofront) {
    const mymodel = {
        "uid": data === null || data === void 0 ? void 0 : data.uid,
        "username": data === null || data === void 0 ? void 0 : data.username,
        "name": data === null || data === void 0 ? void 0 : data.name,
        "password": data === null || data === void 0 ? void 0 : data.password,
        "email": data === null || data === void 0 ? void 0 : data.email,
        "roll": (data === null || data === void 0 ? void 0 : data.roll) || {
            "update": false,
            "write": false,
            "admin": false
        },
        "dateCreated": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateCreated) : (data === null || data === void 0 ? void 0 : data.dateCreated) || "",
        "token": (data === null || data === void 0 ? void 0 : data.token) || ""
    };
    return mymodel;
}
exports.adminUserModel = adminUserModel;
//# sourceMappingURL=panelAdminModels.js.map