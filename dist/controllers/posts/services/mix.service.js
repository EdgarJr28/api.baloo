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
exports.MixServices = void 0;
const mixpost_1 = require("../data/mixpost");
class MixServices {
    getMixOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respon = yield new mixpost_1.MixPostData().getColumnTypeHome();
                const list = yield this.listeMixP(respon);
                return list;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listeMixP(lis) {
        return __awaiter(this, void 0, void 0, function* () {
            let newList = [];
            for (let i = 0; i < lis.length; i++) {
                if (lis.length != newList.length) {
                    const data = yield new mixpost_1.MixPostData().getColumnsData(lis[i]);
                    newList = [...newList, data];
                }
                else {
                    return newList;
                }
            }
            return newList;
        });
    }
}
exports.MixServices = MixServices;
//# sourceMappingURL=mix.service.js.map