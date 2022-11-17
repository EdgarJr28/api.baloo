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
exports.errorValidationSockets = exports.errorValidation = void 0;
function errorValidation(e, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(Date() + "\n Error -> " + e.message);
        res.status(400).json({ ok: false, error: e.code, message: e.message });
    });
}
exports.errorValidation = errorValidation;
function errorValidationSockets(e, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(Date() + "\n Error -> " + e.message);
        return res.status(400).json({ ok: false, error: e.code, message: e.message });
    });
}
exports.errorValidationSockets = errorValidationSockets;
//# sourceMappingURL=errorValidation.js.map