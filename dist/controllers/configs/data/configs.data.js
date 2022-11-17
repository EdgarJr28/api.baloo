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
exports.ConfigsData = void 0;
const DatabaseRoutes_1 = require("../../../libs/DatabaseRoutes");
class ConfigsData {
    constructor() { }
    getConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                DatabaseRoutes_1.fsConfigCollection.get().then((doc) => {
                    resolve(doc.docs.map((v) => {
                        return {
                            uid: v.id,
                            index: v.data().index,
                            type: v.data().type,
                            quantity: v.data().quantity,
                        };
                    }));
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    createColumnTypeHome(newCol) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                DatabaseRoutes_1.fsConfigCollection.doc().create({
                    index: newCol.index,
                    type: newCol.type,
                    quantity: newCol.quantity,
                }).then((doc) => {
                    resolve(doc);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
}
exports.ConfigsData = ConfigsData;
//# sourceMappingURL=configs.data.js.map