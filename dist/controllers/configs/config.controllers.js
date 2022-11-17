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
exports.newColumnTypeHome = void 0;
const configs_services_1 = require("./services/configs.services");
function newColumnTypeHome(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqBody = (req.body);
        const newCol = req.body;
        const respNewCol = yield new configs_services_1.ConfigsServices().createNewColumnTypeHome(newCol);
        console.log(respNewCol);
        return res.status(200).json(respNewCol);
    });
}
exports.newColumnTypeHome = newColumnTypeHome;
//# sourceMappingURL=config.controllers.js.map