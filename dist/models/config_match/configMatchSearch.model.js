"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfigMatchSearchModel = void 0;
function setConfigMatchSearchModel(data) {
    let mydata = {
        aid: data === null || data === void 0 ? void 0 : data.aid,
        dataMatch: {
            lugar: data === null || data === void 0 ? void 0 : data.place,
            sexo: (data === null || data === void 0 ? void 0 : data.sex) || "",
            edad: (data === null || data === void 0 ? void 0 : data.age) || "",
            personalidad: data === null || data === void 0 ? void 0 : data.personality,
            preferencia: (data === null || data === void 0 ? void 0 : data.preference) || "",
            raza: (data === null || data === void 0 ? void 0 : data.race) || "",
            pedigree: data === null || data === void 0 ? void 0 : data.pedigree,
        }
    };
    return mydata;
}
exports.setConfigMatchSearchModel = setConfigMatchSearchModel;
//# sourceMappingURL=configMatchSearch.model.js.map