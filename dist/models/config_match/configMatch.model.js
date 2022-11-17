"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfigMatchModel = void 0;
function setConfigMatchModel(data) {
    let mydata = {
        uid: data.uid,
        config_match: {
            lugar: data === null || data === void 0 ? void 0 : data.lugar,
            sexo: (data === null || data === void 0 ? void 0 : data.sexo) || "",
            edad: (data === null || data === void 0 ? void 0 : data.edad) || "",
            personalidad: data === null || data === void 0 ? void 0 : data.personalidad,
            preferencia: (data === null || data === void 0 ? void 0 : data.preferencia) || "",
            raza: (data === null || data === void 0 ? void 0 : data.raza) || "",
            numero_veces_cruzado: (data === null || data === void 0 ? void 0 : data.numero_veces_cruzado) || "",
            pedigree: (data === null || data === void 0 ? void 0 : data.pedigree) || false,
        },
        token: data === null || data === void 0 ? void 0 : data.token,
        message: (data === null || data === void 0 ? void 0 : data.message) || ""
    };
    return mydata;
}
exports.setConfigMatchModel = setConfigMatchModel;
//# sourceMappingURL=configMatch.model.js.map