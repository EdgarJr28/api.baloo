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
exports.ConfigsServices = void 0;
const express_1 = require("express");
const configs_data_1 = require("../data/configs.data");
class ConfigsServices {
    createNewColumnTypeHome(newCol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resNewColumnDB = yield new configs_data_1.ConfigsData().createColumnTypeHome(newCol);
                return resNewColumnDB;
            }
            catch (error) {
                throw express_1.response.status(500).json(error);
            }
        });
    }
}
exports.ConfigsServices = ConfigsServices;
//# sourceMappingURL=configs.services.js.map