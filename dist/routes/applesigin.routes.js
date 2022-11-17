"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appleAuth_1 = require("../appleSignin/appleAuth");
const AppleRoute = (0, express_1.Router)();
AppleRoute.post("/callback/sign_in_with_apple", appleAuth_1.appleCallBack);
AppleRoute.post("/sign_in_with_apple", appleAuth_1.signInWithApple);
exports.default = AppleRoute;
//# sourceMappingURL=applesigin.routes.js.map