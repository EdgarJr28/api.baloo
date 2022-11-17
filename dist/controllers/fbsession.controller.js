"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fblogin = void 0;
const auth_1 = require("firebase/auth");
function fblogin(request, response) {
    const provider = new auth_1.FacebookAuthProvider();
    const auth = (0, auth_1.getAuth)();
}
exports.fblogin = fblogin;
//# sourceMappingURL=fbsession.controller.js.map