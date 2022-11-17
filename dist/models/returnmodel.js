"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnModel = void 0;
function returnModel(data) {
    const mymodel = {
        "type": data === null || data === void 0 ? void 0 : data.type,
        "id": data === null || data === void 0 ? void 0 : data.id,
        "timer": data === null || data === void 0 ? void 0 : data.timer
    };
    return mymodel;
}
exports.returnModel = returnModel;
//# sourceMappingURL=returnmodel.js.map