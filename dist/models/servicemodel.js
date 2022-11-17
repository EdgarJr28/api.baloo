"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServiceModel = void 0;
const functions_1 = require("../libs/functions");
function setServiceModel(datos, tofront) {
    if (tofront && datos.imgUrl == undefined) {
        datos.imgUrl = "";
    }
    var mymodel = {
        "businessName": datos.businessName,
        "uid": datos.uid,
        "name": datos.name,
        "lastName": datos.lastName,
        "email": datos.email,
        "phone": datos.phone,
        "address": datos.address,
        "city": datos.city,
        "state": datos.state,
        "country": datos.country,
        "specialty": datos.specialty,
        "imgProfile": (datos === null || datos === void 0 ? void 0 : datos.imgUrl) || (datos === null || datos === void 0 ? void 0 : datos.imgProfile),
        "service": datos.service || [],
        "following": (datos === null || datos === void 0 ? void 0 : datos.following) || [],
        "followers": (datos === null || datos === void 0 ? void 0 : datos.followers) || [],
        "plan": datos.plan,
        "sid": datos.serviceID || datos.sid,
        "deleted": datos.deleted,
        "suspended": datos.suspended,
        "dateCreated": tofront ? (0, functions_1.timestampToDate)(datos.dateCreated) : datos.dateCreated,
        "dateUpdated": tofront ? (0, functions_1.timestampToDate)(datos.dateUpdated) : datos.dateUpdated
    };
    if (tofront) {
        for (const key in mymodel) {
            if (mymodel[key] == undefined) {
                delete mymodel[key];
            }
        }
        if (mymodel.imgProfile == undefined || mymodel.imgProfile == "") {
            mymodel.imgProfile = functions_1.profileDefaultIMG;
        }
    }
    return mymodel;
}
exports.setServiceModel = setServiceModel;
//# sourceMappingURL=servicemodel.js.map