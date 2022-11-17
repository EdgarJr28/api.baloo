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
exports.MixPostData = void 0;
const DatabaseRoutes_1 = require("../../../libs/DatabaseRoutes");
const Publicity_1 = require("../../Publicity");
const posts_data_1 = require("./posts.data");
class MixPostData {
    constructor() { }
    getColumnTypeHome() {
        return __awaiter(this, void 0, void 0, function* () {
            let colums = [];
            return new Promise((resolve, reject) => {
                DatabaseRoutes_1.fsConfigCollection.orderBy('index', 'asc').get().then((doc) => {
                    doc.docs.map((v) => {
                        if (v.data().type != undefined) {
                            const newColu = {
                                uid: v.id,
                                index: v.data().index,
                                type: v.data().type,
                                quantity: v.data().quantity,
                            };
                            colums = [...colums, newColu];
                        }
                    });
                    resolve(colums);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getColumnsData(colums) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {};
            return new Promise((resolve, reject) => {
                switch (colums.type) {
                    case 'ad-service':
                        const publicityList = (0, Publicity_1.publicityListBuilder)();
                        publicityList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        });
                        break;
                    case 'ad-adopt':
                        const pubAdoptList = (0, Publicity_1.publicityListBuilder)();
                        pubAdoptList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        });
                        break;
                    case 'ad-post':
                        const pubPostList = (0, Publicity_1.publicityListBuilder)();
                        pubPostList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        });
                        break;
                    case 'post-global':
                        const postGlobalList = new posts_data_1.PostData().getPosts(colums.quantity);
                        postGlobalList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        });
                        break;
                    case 'post-followers':
                        const postFollowersList = new posts_data_1.PostData().getPosts(colums.quantity);
                        postFollowersList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        });
                        break;
                    default:
                }
            });
        });
    }
    ;
}
exports.MixPostData = MixPostData;
//# sourceMappingURL=mixpost.js.map