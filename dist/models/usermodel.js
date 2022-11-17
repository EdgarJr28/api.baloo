"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserModel = void 0;
const functions_1 = require("../libs/functions");
function setUserModel(data, tofront) {
    if (typeof (data === null || data === void 0 ? void 0 : data.facebook) == 'string') {
        data.facebook = (data === null || data === void 0 ? void 0 : data.facebook) == "true" ? true : false;
    }
    if (typeof (data === null || data === void 0 ? void 0 : data.google) == 'string') {
        data.google = (data === null || data === void 0 ? void 0 : data.google) == "true" ? true : false;
    }
    if (typeof (data === null || data === void 0 ? void 0 : data.appleID) == 'string') {
        data.appleID = (data === null || data === void 0 ? void 0 : data.appleID) == "true" ? true : false;
    }
    let mydata = {
        user: {
            "uid": data === null || data === void 0 ? void 0 : data.uid,
            "username": data === null || data === void 0 ? void 0 : data.username,
            "name": (data === null || data === void 0 ? void 0 : data.name) || "",
            "lastname": (data === null || data === void 0 ? void 0 : data.lastname) || "",
            "email": data === null || data === void 0 ? void 0 : data.email,
            "phone": (data === null || data === void 0 ? void 0 : data.phone) || "",
            "age": (data === null || data === void 0 ? void 0 : data.age) || "",
            "address": (data === null || data === void 0 ? void 0 : data.address) || "",
            "country": (data === null || data === void 0 ? void 0 : data.country) || "",
            "city": (data === null || data === void 0 ? void 0 : data.city) || "",
            "postal": (data === null || data === void 0 ? void 0 : data.postal) || "",
            "imgURL": (data === null || data === void 0 ? void 0 : data.imgURL) || "http://app.baloo.pet/uploads/peopleicon.jpeg",
            "online": data === null || data === void 0 ? void 0 : data.online,
            "deleted": (data === null || data === void 0 ? void 0 : data.deleted) || undefined,
            "disable": (data === null || data === void 0 ? void 0 : data.disable) || undefined,
            "facebook": (data === null || data === void 0 ? void 0 : data.facebook) || false,
            "google": (data === null || data === void 0 ? void 0 : data.google) || false,
            "appleID": (data === null || data === void 0 ? void 0 : data.appleID) || false,
            "verifyAccount": data === null || data === void 0 ? void 0 : data.verifyAccount,
            "premium": (data === null || data === void 0 ? void 0 : data.premium) || false,
            "dateCreate": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateCreate) : data === null || data === void 0 ? void 0 : data.dateCreate,
            "dateUpdate": tofront ? (0, functions_1.timestampToDate)(data === null || data === void 0 ? void 0 : data.dateUpdate) : data === null || data === void 0 ? void 0 : data.dateUpdate
        },
        token: data === null || data === void 0 ? void 0 : data.token,
        message: (data === null || data === void 0 ? void 0 : data.message) || ""
    };
    if (tofront) {
        for (const key in mydata.user) {
            if (mydata.user[key] == undefined) {
                delete mydata.user[key];
            }
        }
        if (mydata.user.imgURL == "") {
            mydata.user.imgURL = "http://app.baloo.pet/uploads/peopleicon.png";
        }
    }
    return mydata;
}
exports.setUserModel = setUserModel;
//# sourceMappingURL=usermodel.js.map