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
exports.posttest = exports.getListPost = exports.mixedPost = exports.getPostByID = exports.globalPost = exports.deletePosts = exports.editPosts = exports.createPosts = exports.likePost = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
const validateImages_1 = require("../../libs/validateImages");
const returnmodels_1 = require("../../models/returnmodels");
const firestore_1 = require("firebase-admin/firestore");
const DatabaseRoutes_1 = require("../../libs/DatabaseRoutes");
const postModel_1 = require("../../models/postModel");
const animals_controllers_1 = require("../animals.controllers");
const animalmodel_1 = require("../../models/animalmodel");
const configModule_1 = require("../../libs/configModule");
const functions_1 = require("../../libs/functions");
const mix_service_1 = require("./services/mix.service");
function likePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pid = req.body.pid;
        const profileID = req.body.profileID;
        const postCollection = DatabaseRoutes_1.fsPostCollection.doc(pid);
        if (!(yield postCollection.get()).exists) {
            (0, returnmodels_1.returnBadReq)(res, { message: "Post not found" });
            return;
        }
        const postData = yield (0, postModel_1.setPostModel)((yield postCollection.get()).data());
        var result = undefined;
        var status = "";
        try {
            if (postData === null || postData === void 0 ? void 0 : postData.like.find((x) => x == profileID)) {
                result = postCollection.update({
                    "like": firestore_1.FieldValue.arrayRemove(profileID)
                });
                status = "deleted";
            }
            else {
                result = postCollection.update({
                    "like": firestore_1.FieldValue.arrayUnion(profileID)
                });
                status = "add";
            }
            result.catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, { profileID, status });
            });
        }
        catch (error) {
        }
    });
}
exports.likePost = likePost;
function createPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postsID = (0, uniqid_1.default)('p-');
            const token = req.body.token;
            const post = yield (0, postModel_1.setPostModel)(req.body);
            const paths = yield (0, validateImages_1.getIMGURL)(req.files);
            var dateNow = firestore_1.Timestamp.now();
            post.pid = postsID;
            post.dateCreated = dateNow;
            post.dateUpdated = dateNow;
            post.index = (yield DatabaseRoutes_1.fsPostCollection.get()).size;
            post.multimedia = paths["multimedia"];
            const postColection = DatabaseRoutes_1.fsPostCollection.doc(postsID);
            postColection.set(post).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => __awaiter(this, void 0, void 0, function* () {
                (0, returnmodels_1.returnOK)(res, yield (0, postModel_1.setPostModel)(post, true));
            }));
        }
        catch (err) {
            (0, returnmodels_1.returnServerError)(res, err);
        }
    });
}
exports.createPosts = createPosts;
function editPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postInput = yield (0, postModel_1.setPostModel)(req.body);
        const postCollection = DatabaseRoutes_1.fsPostCollection.doc(postInput.pid);
        const postData = (yield postCollection.get()).data();
        postInput.multimedia = (yield (0, validateImages_1.getIMGURL)(req.files, postData === null || postData === void 0 ? void 0 : postData.multimedia))["multimedia"];
        postInput.dateCreated = postData === null || postData === void 0 ? void 0 : postData.dateCreated;
        delete postInput.like;
        delete postInput.shared;
        postCollection.update(postInput).catch((err) => { (0, returnmodels_1.returnBadReq)(res, err); })
            .then((v) => {
            postInput.dateUpdated = firestore_1.Timestamp.now();
            var final = (0, postModel_1.setPostModel)(postInput, true);
            (0, returnmodels_1.returnOK)(res, final);
        });
    });
}
exports.editPosts = editPosts;
function deletePosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pid = req.body.pid;
        const postCollection = DatabaseRoutes_1.fsPostCollection.doc(pid);
        postCollection.update({
            "deleted": true
        }).catch((err) => {
            (0, returnmodels_1.returnServerError)(res, err);
        }).then((v) => {
            (0, returnmodels_1.returnOK)(res, {});
        });
    });
}
exports.deletePosts = deletePosts;
function globalPost(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const args = req.body;
        const aid = (_a = args.aid) !== null && _a !== void 0 ? _a : "";
        const all = args.all;
        const postID = args.pid;
        var animalExist = false;
        var followingIDList = [];
        var followingPost = [];
        var globalPost = [];
        const postsList = yield (yield DatabaseRoutes_1.fsPostCollection.orderBy("dateCreated", "desc").get()).docChanges();
        var followingDoc = "";
        if (aid != "" && (yield (0, animals_controllers_1.verifyAnimalExist)(aid, res))) {
            followingDoc = (yield (0, animals_controllers_1.getAnimalFollowingDocument)(aid).get()).data();
            Object.keys(followingDoc).map((v) => {
                followingIDList.push(v);
            });
            animalExist = true;
        }
        var i = 0;
        var finalpost = yield new Promise((res, ras) => {
            var final = {};
            postsList.map((post) => __awaiter(this, void 0, void 0, function* () {
                var final = (0, postModel_1.setPostModel)(post.doc.data());
                const animalData = (0, animalmodel_1.setAnimalModel)(yield (yield DatabaseRoutes_1.fsAnimalCollection.doc(final.aid).get()).data());
                final.user.name = animalData.animal.name;
                final.user.imgProfile = animalData.animal.imgProfile;
                if (!final.deleted && (all == undefined || all == false)) {
                    if (followingIDList.find((x) => x == final.aid)) {
                        followingPost.push((0, postModel_1.setPostModel)(final, true));
                    }
                    else {
                        globalPost.push((0, postModel_1.setPostModel)(final, true));
                    }
                }
                if (all == true) {
                    if (followingIDList.find((x) => x == final.aid)) {
                        followingPost.push((0, postModel_1.setPostModel)(final, true));
                    }
                    else {
                        globalPost.push((0, postModel_1.setPostModel)(post.data(), true));
                    }
                }
                i++;
                if (i == postsList.length) {
                    final = { following: followingPost, global: globalPost };
                    res(final);
                }
            }));
        });
        (0, returnmodels_1.returnOK)(res, finalpost);
    });
}
exports.globalPost = globalPost;
function getPostByID(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const postID = req.body.pid;
        const postColection = DatabaseRoutes_1.fsPostCollection.doc(postID);
        if (!(yield postColection.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Post not found" });
            return;
        }
        try {
            const postData = yield (0, postModel_1.setPostModel)((yield postColection.get()).data(), true);
            const userdata = (_b = (yield ((_a = (0, functions_1.getProfileData)(postData.profileID)) === null || _a === void 0 ? void 0 : _a.get()))) === null || _b === void 0 ? void 0 : _b.data();
            postData.user.name = userdata === null || userdata === void 0 ? void 0 : userdata.name;
            postData.user.imgProfile = userdata === null || userdata === void 0 ? void 0 : userdata.imgProfile;
            (0, returnmodels_1.returnOK)(res, postData);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getPostByID = getPostByID;
function mixedPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = req.body;
        const profileID = args.profileID;
        (new mix_service_1.MixServices().getMixOrder()).then((c) => {
            (0, returnmodels_1.returnOK)(res, c);
        }).catch((err) => {
            (0, returnmodels_1.returnServerError)(res, err);
        });
    });
}
exports.mixedPost = mixedPost;
function sortingPost(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const postFollowingSect = configModule_1.AppMainConfig.nNumberFollowingSectView;
        const postGlobalSect = configModule_1.AppMainConfig.nNumberPostGlobalSectView;
        const FollowingPost = data.followingPost;
        const GlobalPost = data.globalPost;
        const pubPost = data.publicityPost;
        const TotalSpins = Object.keys(GlobalPost).length / postGlobalSect;
        const TotalFollowingSpins = FollowingPost.length / postGlobalSect;
        var finalpost = [];
        var followingSpin = 0;
        var GlobalSpin = 0;
        var pubPostSpin = 0;
        var currentFollowsPost = 0;
        function sortFollowingPost() {
            if (followingSpin < TotalFollowingSpins) {
                var currentpost = currentFollowsPost;
                for (currentpost; currentpost < currentFollowsPost + postFollowingSect; currentpost++) {
                    const post = FollowingPost[currentpost];
                    if (post != undefined) {
                        finalpost.push(post);
                    }
                }
                followingSpin++;
            }
        }
        var currentGlobalPost = 0;
        function sortGlobalPost() {
            var currentpost = currentGlobalPost;
            for (currentpost; currentpost < currentGlobalPost + postGlobalSect; currentpost++) {
                const post = GlobalPost[currentpost];
                if (post != undefined) {
                    finalpost.push(post);
                }
            }
            currentGlobalPost = currentpost;
        }
        while (GlobalSpin < TotalSpins) {
            sortFollowingPost();
            sortGlobalPost();
            GlobalSpin++;
        }
        return finalpost;
    });
}
function getListPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield (0, postModel_1.setPostModel)(req.body);
        const postDoc = (yield DatabaseRoutes_1.fsPostCollection.where("profileID", "==", profile.profileID).orderBy("index", "desc").get()).docs;
        var postList = [];
        var i = 0;
        postDoc.map((post) => __awaiter(this, void 0, void 0, function* () {
            var ps = yield (0, postModel_1.setPostModel)(post.data(), true);
            postList.push(ps);
            i++;
            if (i == postDoc.length) {
                (0, returnmodels_1.returnOK)(res, postList);
            }
        }));
        console.log();
    });
}
exports.getListPost = getListPost;
function posttest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var finals = [];
        (yield DatabaseRoutes_1.fsPostCollection.orderBy("dateCreated", "desc").get()).docs.map((doc) => {
        });
        (0, returnmodels_1.returnOK)(res, finals);
    });
}
exports.posttest = posttest;
//# sourceMappingURL=posts.controller.js.map