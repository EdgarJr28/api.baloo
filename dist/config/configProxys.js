"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiMail = exports.apiMedia = void 0;
const dist_1 = require("middleware-axios/dist");
exports.apiMedia = (0, dist_1.create)({
    baseURL: 'http://localhost:2001/',
});
exports.apiMail = (0, dist_1.create)({
    baseURL: 'https://baloo.pet/mail',
});
//# sourceMappingURL=configProxys.js.map