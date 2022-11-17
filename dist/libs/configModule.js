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
exports.perareConfig = exports.configModel = exports.configDoc = exports.AppMainConfig = void 0;
const config_database_1 = require("../config/config.database");
const Test_1 = require("./Test");
const configColl = config_database_1.fsRoot.collection("config");
exports.configDoc = configColl.doc("config");
function configModel(data) {
    const mydata = {
        "npostGlobal": (data === null || data === void 0 ? void 0 : data.npost) || 0,
        "maxpostview": (data === null || data === void 0 ? void 0 : data.maxpostview) || 20,
        "nNumberFollowingSectView": (data === null || data === void 0 ? void 0 : data.nNumberFollowingSectView) || 3,
        "nNumberPostGlobalSectView": (data === null || data === void 0 ? void 0 : data.nNumberPostGlobalSectView) || 3,
        "nNumberPubSectView": (data === null || data === void 0 ? void 0 : data.nNumberPubSectView) || 1,
        "secretJWT": (data === null || data === void 0 ? void 0 : data.secretJWT) || "35jgg@#$^dfjn2VY&^2"
    };
    return mydata;
}
exports.configModel = configModel;
function perareConfig(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reading Settings");
        (0, Test_1.updateindex)();
        if ((yield configColl.get()).empty) {
            console.log("config empy");
            exports.configDoc.set(configModel()).then((v) => {
                exports.AppMainConfig = configModel();
                console.log("save default config on db");
            });
        }
        else {
            exports.AppMainConfig = configModel((yield exports.configDoc.get()).data());
            console.log("all Settings Readed");
        }
    });
}
exports.perareConfig = perareConfig;
//# sourceMappingURL=configModule.js.map