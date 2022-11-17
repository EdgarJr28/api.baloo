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
exports.mediaReturn = void 0;
const storys_controllers_1 = require("../controllers/storys.controllers");
const returnmodel_1 = require("../models/returnmodel");
function mediaReturn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = (0, returnmodel_1.returnModel)(req.body);
        switch (model.type) {
            case "story":
                (0, storys_controllers_1.deleteStory)(req, res);
                break;
        }
        console.log();
    });
}
exports.mediaReturn = mediaReturn;
//# sourceMappingURL=MediaReturn.js.map