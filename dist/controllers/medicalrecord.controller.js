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
exports.getfromMID = exports.deleteMedicalRecord = exports.updateMedicalrecord = exports.getlistbyAID = exports.createMedicalRecord = void 0;
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const medicalRecordsModel_1 = require("../models/medicalRecordsModel");
const returnmodels_1 = require("../models/returnmodels");
const uniqid = require('uniqid');
function createMedicalRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var aid = req.params.aid;
            var data = req.body;
            var medicalID = uniqid("M-");
            const profileDoc = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield profileDoc.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, { message: "Perfil no encontrado" });
                return;
            }
            switch (data.type) {
                case "":
                    (0, returnmodels_1.returnBadReq)(res, { message: "type cant be empy" });
                    return;
                    break;
                case "vaccine":
                case "allergy":
                case "proxVaccine":
                    break;
                default:
                    (0, returnmodels_1.returnBadReq)(res, { message: "type medical  not recognize; only use vaccine,allergy,proxVaccine" });
                    return;
                    break;
            }
            const date = firestore_1.Timestamp.now();
            data = Object.assign(Object.assign({}, data), { mid: medicalID });
            const medicalInput = (0, medicalRecordsModel_1.setMedicalRecordModel)(data);
            medicalInput.dateCreate = date;
            const collection = yield (0, medicalRecordsModel_1.getMedicalRecordsCollection)(aid);
            collection === null || collection === void 0 ? void 0 : collection.doc(medicalID).set(medicalInput);
            (0, returnmodels_1.returnOK)(res, (0, medicalRecordsModel_1.setMedicalRecordModel)(medicalInput, true));
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.createMedicalRecord = createMedicalRecord;
function getlistbyAID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aid = req.params.aid;
            const all = req.body.all;
            var profile = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield profile.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, { message: "profile not found" });
                return;
            }
            var collection = yield (0, medicalRecordsModel_1.getMedicalRecordsCollectionAsObject)(aid, all);
            (0, returnmodels_1.returnOK)(res, collection);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getlistbyAID = getlistbyAID;
function updateMedicalrecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aid = req.params.aid;
            const dataInput = req.body;
            switch (dataInput.mid) {
                case undefined:
                case "":
                    (0, returnmodels_1.returnBadReq)(res, { message: "mid is empy" });
                    return;
            }
            const medicalCollection = yield (0, medicalRecordsModel_1.getMedicalRecordsCollection)(aid);
            const medicalDocument = medicalCollection.doc(dataInput.mid);
            if (!(yield medicalDocument.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, { message: "medical not found" });
                return;
            }
            medicalDocument.update(dataInput);
            (0, returnmodels_1.returnOK)(res, (0, medicalRecordsModel_1.setMedicalRecordModel)(dataInput, true));
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.updateMedicalrecord = updateMedicalrecord;
function deleteMedicalRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const aid = req.params.aid;
        const dataInput = req.body;
        const mid = req.body.mid;
        switch (mid) {
            case undefined:
            case "":
                (0, returnmodels_1.returnBadReq)(res, { message: "mid is empy" });
                return;
        }
        const medicalCollection = yield (0, medicalRecordsModel_1.getMedicalRecordsCollection)(aid);
        const medicalDocument = medicalCollection.doc(dataInput.mid);
        if (!(yield medicalDocument.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "medical not found" });
            return;
        }
        const mdata = (0, medicalRecordsModel_1.setMedicalRecordModel)(dataInput, false, true);
        mdata[mid].deleted = true;
        medicalDocument.update(mdata[mid]).then(() => {
            (0, returnmodels_1.returnOK)(res, {});
        }).catch((err) => {
            (0, returnmodels_1.returnBadReq)(res, err);
        });
    });
}
exports.deleteMedicalRecord = deleteMedicalRecord;
function getfromMID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const aid = req.params.aid;
        const dataInput = req.body;
        const mid = req.body.mid;
        switch (mid) {
            case undefined:
            case "":
                (0, returnmodels_1.returnBadReq)(res, { message: "mid is empy" });
                return;
        }
        const medicalDocument = (yield (0, medicalRecordsModel_1.getMedicalRecordsCollection)(aid)).doc(mid);
        if (!(yield medicalDocument.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "medical not found" });
            return;
        }
        try {
            const mdata = (0, medicalRecordsModel_1.setMedicalRecordModel)((yield medicalDocument.get()).data(), true);
            (0, returnmodels_1.returnOK)(res, mdata);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getfromMID = getfromMID;
//# sourceMappingURL=medicalrecord.controller.js.map