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
exports.getMatchesDocument = exports.getMatchRequestDocument = exports.getMatchSendedDocument = exports.sendMatch = exports.getMatchProfiles = void 0;
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const configMatchSearch_model_1 = require("../models/config_match/configMatchSearch.model");
const match_model_1 = require("../models/match.model");
const returnmodels_1 = require("../models/returnmodels");
const animals_controllers_1 = require("./animals.controllers");
function getMatchProfiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configAnimal = (0, configMatchSearch_model_1.setConfigMatchSearchModel)(req.body);
            const specie = req.body.specie;
            const animalsDoc = yield DatabaseRoutes_1.fsAnimalCollection.where("species", "==", specie).get();
            const allProfilesWithModelSearch = [];
            const profilesWhitConfigMatches = [];
            animalsDoc.docs.map((st) => __awaiter(this, void 0, void 0, function* () {
                const profilesWithModelSearch = (0, configMatchSearch_model_1.setConfigMatchSearchModel)(st.data());
                allProfilesWithModelSearch.push(profilesWithModelSearch);
            }));
            for (const profile of allProfilesWithModelSearch) {
                if (JSON.stringify(configAnimal.dataMatch) === JSON.stringify(profile.dataMatch)) {
                    const dataProfile = DatabaseRoutes_1.fsAnimalCollection.doc(profile.aid);
                    profilesWhitConfigMatches.push((yield dataProfile.get()).data());
                }
            }
            return res.json({ data: profilesWhitConfigMatches });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            return res.status(500).json(error.message);
        }
    });
}
exports.getMatchProfiles = getMatchProfiles;
function sendMatch(req, res) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var date = firestore_1.Timestamp.now();
            const body = req.body;
            const aid_sender = body.aid_sender;
            const aid_request = body.aid_request;
            ;
            var dataSender = undefined;
            var dataRequest = undefined;
            var aid_sender_doc = undefined;
            var aid_request_doc = undefined;
            var aid_sender_matched_doc = undefined;
            var aid_request_matched_doc = undefined;
            if (aid_sender.includes("A-")) {
                if (aid_sender != undefined && !(yield (0, animals_controllers_1.verifyAnimalExist)(aid_sender, res))) {
                    return;
                }
                dataSender = DatabaseRoutes_1.fsAnimalCollection.doc(aid_sender);
                aid_sender_doc = getMatchSendedDocument(aid_sender);
                aid_sender_matched_doc = getMatchesDocument(aid_sender);
            }
            if (aid_request.includes("A-")) {
                if (aid_request != undefined && !(yield (0, animals_controllers_1.verifyAnimalExist)(aid_request, res))) {
                    return;
                }
                dataRequest = DatabaseRoutes_1.fsAnimalCollection.doc(aid_request);
                aid_request_doc = getMatchRequestDocument(aid_request);
                aid_request_matched_doc = getMatchesDocument(aid_request);
            }
            const verify = yield verifyRequestMatch(aid_sender, aid_request);
            let to_match_request = (0, match_model_1.setMatchModel)(aid_sender, "", (_a = (yield (dataSender === null || dataSender === void 0 ? void 0 : dataSender.get()))) === null || _a === void 0 ? void 0 : _a.data(), date);
            let to_match_sender = (0, match_model_1.setMatchModel)(aid_request, " ", (_b = (yield (dataRequest === null || dataRequest === void 0 ? void 0 : dataRequest.get()))) === null || _b === void 0 ? void 0 : _b.data(), date);
            var senderData = (_c = (yield (aid_sender_doc === null || aid_sender_doc === void 0 ? void 0 : aid_sender_doc.get()))) === null || _c === void 0 ? void 0 : _c.data();
            var requestData = (_d = (yield (aid_request_doc === null || aid_request_doc === void 0 ? void 0 : aid_request_doc.get()))) === null || _d === void 0 ? void 0 : _d.data();
            var senderMatchData = (_e = (yield (aid_sender_matched_doc === null || aid_sender_matched_doc === void 0 ? void 0 : aid_sender_matched_doc.get()))) === null || _e === void 0 ? void 0 : _e.data();
            var requestMatchData = (_f = (yield (aid_request_matched_doc === null || aid_request_matched_doc === void 0 ? void 0 : aid_request_matched_doc.get()))) === null || _f === void 0 ? void 0 : _f.data();
            if (verify) {
                if (senderMatchData == undefined) {
                    to_match_request[aid_sender].status = "matched";
                    yield (aid_sender_matched_doc === null || aid_sender_matched_doc === void 0 ? void 0 : aid_sender_matched_doc.set(to_match_sender));
                    console.log(aid_request);
                    yield (aid_sender_doc === null || aid_sender_doc === void 0 ? void 0 : aid_sender_doc.delete({
                        [aid_request]: firestore_1.FieldValue.delete()
                    }));
                }
                else {
                    to_match_request[aid_sender].status = "matched";
                    yield (aid_sender_matched_doc === null || aid_sender_matched_doc === void 0 ? void 0 : aid_sender_matched_doc.update(to_match_sender));
                    console.log(aid_request);
                    yield (aid_sender_doc === null || aid_sender_doc === void 0 ? void 0 : aid_sender_doc.delete({
                        [aid_request]: firestore_1.FieldValue.delete()
                    }));
                }
                if (requestMatchData == undefined) {
                    yield (aid_request_matched_doc === null || aid_request_matched_doc === void 0 ? void 0 : aid_request_matched_doc.set(to_match_request));
                    to_match_sender[aid_request].status = "matched";
                    yield (aid_request_doc === null || aid_request_doc === void 0 ? void 0 : aid_request_doc.delete({
                        [aid_sender]: firestore_1.FieldValue.delete()
                    }));
                }
                else {
                    yield (aid_request_matched_doc === null || aid_request_matched_doc === void 0 ? void 0 : aid_request_matched_doc.update(to_match_request));
                    to_match_sender[aid_request].status = "matched";
                    yield (aid_request_doc === null || aid_request_doc === void 0 ? void 0 : aid_request_doc.delete({
                        [aid_sender]: firestore_1.FieldValue.delete()
                    }));
                }
                return (0, returnmodels_1.returnOK)(res, to_match_request[aid_sender]);
            }
            else if (senderData == undefined) {
                yield (aid_sender_doc === null || aid_sender_doc === void 0 ? void 0 : aid_sender_doc.set(to_match_sender));
                to_match_request[aid_sender].status = "wait";
                console.log("create id");
            }
            else {
                console.log("update id");
                yield (aid_sender_doc === null || aid_sender_doc === void 0 ? void 0 : aid_sender_doc.update(to_match_sender));
                to_match_request[aid_sender].status = "wait";
            }
            if (requestData == undefined) {
                yield (aid_request_doc === null || aid_request_doc === void 0 ? void 0 : aid_request_doc.set(to_match_request));
                to_match_sender[aid_request].status = "wait";
            }
            else {
                console.log("update id");
                yield (aid_request_doc === null || aid_request_doc === void 0 ? void 0 : aid_request_doc.update(to_match_request));
                to_match_sender[aid_request].status = "wait";
            }
            (0, returnmodels_1.returnOK)(res, to_match_request[aid_sender]);
        }
        catch (e) {
            throw res.status(500).json(e.message);
        }
    });
}
exports.sendMatch = sendMatch;
function getMatchSendedDocument(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("match").doc("match_sended");
}
exports.getMatchSendedDocument = getMatchSendedDocument;
function getMatchRequestDocument(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("match").doc("match_request");
}
exports.getMatchRequestDocument = getMatchRequestDocument;
function getMatchesDocument(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("match").doc("matches");
}
exports.getMatchesDocument = getMatchesDocument;
function verifyRequestMatch(idHost, idRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const verify = yield (0, match_model_1.getFullMatchList)(idHost, true);
        for (var animal in verify.match_request) {
            if (verify.match_request[animal].aid == idRequest) {
                return true;
            }
        }
        return false;
    });
}
//# sourceMappingURL=matchs.controller.js.map