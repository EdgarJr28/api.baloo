"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showError = exports.returnOK = exports.returnServerError = exports.returnBadReq = exports.returnUnauthorized = exports.returnNotFound = exports.returnConflict = void 0;
const index_controllers_1 = require("../controllers/index.controllers");
function returnConflict(res, obj, code) {
    returnmessageerror(res, 409, obj);
}
exports.returnConflict = returnConflict;
function returnNotFound(res, obj, code) {
    returnmessageerror(res, 404, obj);
}
exports.returnNotFound = returnNotFound;
function returnUnauthorized(res, obj, code) {
    returnmessageerror(res, 401, obj);
}
exports.returnUnauthorized = returnUnauthorized;
function returnBadReq(res, obj, code) {
    returnmessageerror(res, 400, obj);
}
exports.returnBadReq = returnBadReq;
function returnServerError(res, obj, code) {
    returnmessageerror(res, 500, obj);
}
exports.returnServerError = returnServerError;
function returnOK(res, obj) {
    returnmessage(res, 200, obj);
}
exports.returnOK = returnOK;
function returnmessage(res, status, obj) {
    if (index_controllers_1.DEBUG) {
        console.log("_");
        console.warn("-------- LOG -------- ");
        console.log(Date());
        console.log();
        console.error(obj);
        console.log("-----------------------");
        console.log("_");
    }
    return res.status(status).json(obj);
}
function returnmessageerror(res, status, obj, code) {
    showError(obj);
    const model = {
        message: (obj === null || obj === void 0 ? void 0 : obj.message) || obj || ""
    };
    return res.status(status).json(model) || true;
}
function showError(obj) {
    console.log("_");
    console.warn("-------- Error -------- ");
    console.log(Date());
    console.log();
    console.error(obj);
    console.log("-----------------------");
    console.log("_");
}
exports.showError = showError;
//# sourceMappingURL=returnmodels.js.map