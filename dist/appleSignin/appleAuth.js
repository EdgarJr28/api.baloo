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
exports.signInWithApple = exports.appleCallBack = void 0;
const AuthConfig_1 = require("./AuthConfig");
const AppleAuth = require('apple-auth');
const jwt = require("jsonwebtoken");
function appleCallBack(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("---------------------- Appple Callback -------------------");
        try {
            console.log(req === null || req === void 0 ? void 0 : req.body);
            const redirect = `intent://callback?${new URLSearchParams(req.body).toString()}#Intent;package=${AuthConfig_1.ANDROID_PACKAGE_IDENTIFIER};scheme=signinwithapple;end`;
            console.log(`Redirecting to ${redirect}`);
            res.redirect(307, redirect);
        }
        catch (error) {
            console.log(`Callback error: ${error}`);
        }
        console.log("---------------------- -------------------");
    });
}
exports.appleCallBack = appleCallBack;
function signInWithApple(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("---------------------- Appple SignIn -------------------");
        try {
            console.log(req === null || req === void 0 ? void 0 : req.body);
            const auth = new AppleAuth({
                client_id: req.query.useBundleId === "true"
                    ? AuthConfig_1.authAppleKey.BUNDLEID
                    : AuthConfig_1.authAppleKey.SERVICEID,
                team_id: AuthConfig_1.authAppleKey.SERVICEID,
                redirect_uri: AuthConfig_1.authAppleKey.APPLE_REDIRECT_URL,
                key_id: AuthConfig_1.authAppleKey.KEYID,
            }, AuthConfig_1.authAppleKey.KEYP8.replace(/\|/g, "\n"), "text");
            console.log("--------------------APPLE SIGN IN -------------------");
            console.log(req.query);
            const accessToken = yield auth.accessToken(req.query.code);
            const idToken = jwt.decode(accessToken.id_token);
            const userID = idToken.sub;
            console.log(idToken);
            const userEmail = idToken.email;
            const userName = `${req.query.firstName} ${req.query.lastName}`;
            const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;
            console.log(`sessionID = ${sessionID}`);
            res.json({ sessionId: sessionID });
        }
        catch (error) {
            console.log(`signInWithApple error: ${error}`);
        }
        console.log("---------------------- -------------------");
    });
}
exports.signInWithApple = signInWithApple;
//# sourceMappingURL=appleAuth.js.map