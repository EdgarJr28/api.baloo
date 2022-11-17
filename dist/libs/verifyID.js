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
exports.verifyStory = exports.verifyLike = exports.verifyFollowAnimal = exports.verifyIDAnimal = exports.verifyID = void 0;
const database_1 = require("firebase/database");
function verifyID(id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const r = (0, database_1.ref)(dbs, `userPerfilDates/${id}`);
            (0, database_1.get)(r).then((response) => __awaiter(this, void 0, void 0, function* () {
                var data = yield response.val();
                if (data) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }));
        }
        catch (error) {
            console.log(Date());
            console.log(error);
        }
    });
}
exports.verifyID = verifyID;
function verifyIDAnimal(id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const r = (0, database_1.ref)(dbs, `animalsUser/${id}`);
            (0, database_1.get)(r).then((response) => __awaiter(this, void 0, void 0, function* () {
                var data = yield response.val();
                if (data) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }));
        }
        catch (error) {
            console.log(Date());
            console.log(error);
        }
    });
}
exports.verifyIDAnimal = verifyIDAnimal;
function verifyFollowAnimal(id, followerAID, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const r = (0, database_1.ref)(dbs, `animalsUser/${id}`);
            const db = (0, database_1.ref)(dbs, `animalsUser/${id}/followers/${followerAID}`);
            (0, database_1.get)(db).then((response) => __awaiter(this, void 0, void 0, function* () {
                var data = yield response.val();
                if (data) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }));
        }
        catch (error) {
            console.log(Date());
            console.log(error);
        }
    });
}
exports.verifyFollowAnimal = verifyFollowAnimal;
function verifyLike(id, postId, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const r = (0, database_1.ref)(dbs, `posts/${postId}/likes/${id}`);
            (0, database_1.get)(r).then((response) => __awaiter(this, void 0, void 0, function* () {
                var data = yield response.val();
                if (data) {
                    callback(true);
                }
                else {
                    callback(false);
                }
                return;
            }));
        }
        catch (error) {
            console.log(Date());
            console.log(error);
        }
    });
}
exports.verifyLike = verifyLike;
function verifyStory(id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbs = (0, database_1.getDatabase)();
            const r = (0, database_1.ref)(dbs, `storys/${id}`);
            (0, database_1.get)(r).then((response) => __awaiter(this, void 0, void 0, function* () {
                var data = yield response.val();
                if (data) {
                    callback(true);
                }
                else {
                    callback(false);
                }
                return;
            }));
        }
        catch (error) {
            console.log(Date());
            console.log(error);
        }
    });
}
exports.verifyStory = verifyStory;
//# sourceMappingURL=verifyID.js.map