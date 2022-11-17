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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStory = exports.getStorysByProfileID = exports.getStorysList = exports.createStory = exports.MediaServer = void 0;
const configProxys_1 = require("../config/configProxys");
const returnmodels_1 = require("../models/returnmodels");
const uniqid_1 = __importDefault(require("uniqid"));
const storyModel_1 = require("../models/storyModel");
const validateImages_1 = require("../libs/validateImages");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const firestore_1 = require("firebase-admin/firestore");
const timeoutTimers_1 = require("../config/timeoutTimers");
const functions_1 = require("../libs/functions");
const follow_1 = require("./follow");
const returnmodel_1 = require("../models/returnmodel");
function MediaServer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        configProxys_1.apiMedia.get('/media').then(response => {
            console.log(response.data);
            return res.status(200).json(response.data);
        }).catch((err) => {
            (0, returnmodels_1.returnServerError)(res, "Error to connect with media server");
        });
    });
}
exports.MediaServer = MediaServer;
function createStory(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const stid = (0, uniqid_1.default)("st-");
        var storydata = (0, storyModel_1.setStoryModel)(req.body);
        const media = (yield (0, validateImages_1.getIMGURL)(req.files))["storymedia"];
        const date = firestore_1.Timestamp.now();
        var profileData = (_b = (yield ((_a = (yield (0, functions_1.getProfileData)(storydata.profileID))) === null || _a === void 0 ? void 0 : _a.get()))) === null || _b === void 0 ? void 0 : _b.data();
        const storyCollection = DatabaseRoutes_1.fsStoryCollection.doc(stid);
        storydata.stid = stid;
        storydata.multimedia = media;
        storydata.dateCreated = date;
        storydata.dateUpdate = date;
        storydata.user.imgProfile = (_c = yield (profileData === null || profileData === void 0 ? void 0 : profileData.imgProfile)) !== null && _c !== void 0 ? _c : functions_1.profileDefaultIMG;
        const final = (0, storyModel_1.setStoryModel)(storydata, true);
        const model = (0, returnmodel_1.returnModel)({ "type": "story", "id": stid, "timer": timeoutTimers_1.storyTimeout });
        try {
            var a = yield configProxys_1.apiMedia.post("/timeout/set", model);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
            return;
        }
        storyCollection.set(storydata).catch((err) => {
            (0, returnmodels_1.returnBadReq)(res, err);
            return;
        }).then((v) => {
            (0, returnmodels_1.returnOK)(res, final);
        });
    });
}
exports.createStory = createStory;
function getStorysList(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const storydata = (0, storyModel_1.setStoryModel)(req.body);
        var animalexist = false;
        var followingStorys = {};
        var stGlobal = {};
        var sortedGlobal = {};
        var followingIDList = [];
        var totalpost = {};
        try {
            var profileData = yield (0, functions_1.getProfileData)(storydata.profileID);
            if (storydata.profileID != undefined && storydata.profileID != "") {
                if ((_a = (yield (profileData === null || profileData === void 0 ? void 0 : profileData.get()))) === null || _a === void 0 ? void 0 : _a.exists) {
                    const following = (_c = (yield ((_b = (yield (0, follow_1.getFollowingsFromProfileDocument)(storydata.profileID))) === null || _b === void 0 ? void 0 : _b.get()))) === null || _c === void 0 ? void 0 : _c.data();
                    if (following != undefined) {
                        Object.keys(following).map((d) => {
                            followingIDList.push(d);
                        });
                    }
                }
            }
            const storyList = (yield DatabaseRoutes_1.fsStoryCollection.get()).docs;
            var i = 0;
            if (storyList.length == 0) {
                (0, returnmodels_1.returnOK)(res, stGlobal);
                return;
            }
            function setstorymode(story) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (followingIDList.find((x) => x == story.profileID)) {
                        followingStorys.push(story);
                    }
                    else {
                        stGlobal.push(story);
                    }
                });
            }
            storyList.map((st) => __awaiter(this, void 0, void 0, function* () {
                var _d, _e;
                var story = (0, storyModel_1.setStoryModel)(st.data(), true);
                var id = story.profileID;
                var sto = (_e = (_d = followingStorys[id]) !== null && _d !== void 0 ? _d : stGlobal[id]) !== null && _e !== void 0 ? _e : [];
                sto.push(story);
                totalpost[id] = sto;
                if (followingIDList.find((x) => x == id)) {
                    followingStorys[id] = (sto);
                }
                else {
                    stGlobal[id] = (sto);
                }
                i++;
                if (i == storyList.length) {
                    Object.keys(stGlobal).map((v) => {
                        sortedGlobal = Object.assign(Object.assign({}, sortedGlobal), { [v]: stGlobal[v] });
                    });
                    Object.keys(followingStorys).map((v) => {
                        sortedGlobal = Object.assign(Object.assign({}, sortedGlobal), { [v]: followingStorys[v] });
                    });
                    var a = JSON.stringify(sortedGlobal);
                    (0, returnmodels_1.returnOK)(res, sortedGlobal);
                }
            }));
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getStorysList = getStorysList;
function getStorysByProfileID(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const profileID = req.body.profileID;
        const animalDoc = yield (0, functions_1.getProfileData)(profileID);
        if (!((_a = (yield (animalDoc === null || animalDoc === void 0 ? void 0 : animalDoc.get()))) === null || _a === void 0 ? void 0 : _a.exists)) {
            (0, returnmodels_1.returnBadReq)(res, { message: "perfil no existe" });
            return;
        }
        var storyList = [];
        const postDoc = yield DatabaseRoutes_1.fsStoryCollection.where("profileID", "==", profileID).get();
        var i = 0;
        postDoc.docs.map((st) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const tempAnimalData = (_b = (yield (animalDoc === null || animalDoc === void 0 ? void 0 : animalDoc.get()))) === null || _b === void 0 ? void 0 : _b.data();
            const cst = (0, storyModel_1.setStoryModel)(st.data(), true, tempAnimalData);
            storyList.push(cst);
            i++;
            if (i == postDoc.size) {
                (0, returnmodels_1.returnOK)(res, storyList);
            }
        }));
    });
}
exports.getStorysByProfileID = getStorysByProfileID;
function deleteStory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = "";
        if (!req.body.type) {
            id = (0, storyModel_1.setStoryModel)(req.body).stid;
        }
        else {
            id = req.body.id;
        }
        const storyDoc = DatabaseRoutes_1.fsStoryCollection.doc(id);
        if (!(yield storyDoc.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Story Not Found" });
            return;
        }
        storyDoc.delete().catch((err) => {
            (0, returnmodels_1.returnBadReq)(res, err);
        }).then((v) => {
            (0, returnmodels_1.returnOK)(res, {});
        });
    });
}
exports.deleteStory = deleteStory;
//# sourceMappingURL=storys.controllers.js.map