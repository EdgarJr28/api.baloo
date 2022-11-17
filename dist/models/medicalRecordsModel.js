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
exports.getMedicalRecordsCollectionAsObject = exports.getMedicalRecordsCollection = exports.setMedicalRecordModel = void 0;
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const functions_1 = require("../libs/functions");
function setMedicalRecordModel(data, universalTime, nullfields) {
    var model = {
        "mid": data.mid,
        "title": data.title || "",
        "date": data.date || "",
        "vetName": data.vetName || "",
        "region": data.region || "",
        "vaccName": data.vaccName || "",
        "comment": data.comment || "",
        "dateCreate": universalTime ? (0, functions_1.timestampToDate)(data.dateCreate) : data.dateCreate,
        "deleted": data.deleted || undefined,
        "type": data.type || ""
    };
    if (nullfields) {
        for (const key in model[data.mid]) {
            if (model[key] == "") {
                model[key] = undefined;
            }
        }
    }
    return model;
}
exports.setMedicalRecordModel = setMedicalRecordModel;
function getMedicalRecordsCollection(aid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("medicalRecord");
        ;
    });
}
exports.getMedicalRecordsCollection = getMedicalRecordsCollection;
function getMedicalRecordsCollectionAsObject(aid, showdeleted) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = (yield getMedicalRecordsCollection(aid)).get();
        var list = [];
        (yield profile).forEach((v) => {
            const data = setMedicalRecordModel(v.data(), true);
            if (!data.deleted) {
                list.push(data);
            }
            if (data.deleted && showdeleted) {
                list.push(data);
            }
        });
        return list;
    });
}
exports.getMedicalRecordsCollectionAsObject = getMedicalRecordsCollectionAsObject;
//# sourceMappingURL=medicalRecordsModel.js.map