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
exports.PostData = void 0;
const DatabaseRoutes_1 = require("../../../libs/DatabaseRoutes");
class PostData {
    getPosts(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts = [];
            return new Promise((resolve, reject) => {
                DatabaseRoutes_1.fsPostCollection.orderBy('dateCreated', 'desc').limit(limit).get().then((doc) => {
                    doc.docs.map((v) => __awaiter(this, void 0, void 0, function* () {
                        const myPost = v.data();
                        posts = [...posts, myPost];
                    }));
                    resolve(posts);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
}
exports.PostData = PostData;
//# sourceMappingURL=posts.data.js.map