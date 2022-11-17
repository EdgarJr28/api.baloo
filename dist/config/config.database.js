"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsRoot = void 0;
const service_account_json_1 = __importDefault(require("../service-account.json"));
const firestore_1 = require("firebase-admin/firestore");
const admin = __importStar(require("firebase-admin"));
const app_1 = require("firebase-admin/app");
require("firebase/app");
const app_2 = require("firebase/app");
const params = {
    type: service_account_json_1.default.type,
    projectId: service_account_json_1.default.project_id,
    apiKey: service_account_json_1.default.apiKey,
    privateKeyId: service_account_json_1.default.private_key_id,
    privateKey: service_account_json_1.default.private_key,
    clientEmail: service_account_json_1.default.client_email,
    clientId: service_account_json_1.default.client_id,
    authUri: service_account_json_1.default.auth_uri,
    tokenUri: service_account_json_1.default.token_uri,
    authProviderX509CertUrl: service_account_json_1.default.auth_provider_x509_cert_url,
    clientC509CertUrl: service_account_json_1.default.client_x509_cert_url,
    credential: (0, app_1.applicationDefault)(),
    databaseURL: "https://exalted-mode-338017-default-rtdb.firebaseio.com"
};
console.log("Initialize firebase");
(0, app_2.initializeApp)(params);
admin.initializeApp({
    credential: admin.credential.cert(params)
});
exports.fsRoot = (0, firestore_1.getFirestore)();
exports.fsRoot.settings({ ignoreUndefinedProperties: true });
function dbON() {
    return __awaiter(this, void 0, void 0, function* () {
        const dt = yield exports.fsRoot.collection("root").get();
        dt.forEach((data) => {
            console.log(data.id + " => " + data.data()["status"]);
        });
    });
}
exports.default = dbON;
//# sourceMappingURL=config.database.js.map