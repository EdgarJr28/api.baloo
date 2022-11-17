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
exports.optimizeIMG = exports.deleteFile = exports.getIMGURL = void 0;
const configRoot_1 = require("../config/configRoot");
const fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const index_controllers_1 = require("../controllers/index.controllers");
const sharp_1 = __importDefault(require("sharp"));
function getIMGURL(paths, oldfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var imgs = {};
            try {
                if (oldfile != "" && oldfile != undefined && (paths === null || paths === void 0 ? void 0 : paths.length) > 0) {
                    oldfile = oldfile.replace(configRoot_1.domain, configRoot_1.dirRoot);
                    yield deleteFile(oldfile);
                    if (index_controllers_1.DEBUG)
                        console.log("deleted file");
                }
            }
            catch (error) {
                if (index_controllers_1.DEBUG) {
                    console.log("-------- Error Delete Old File multimedia ----------");
                    console.error(error);
                }
            }
            if (paths === undefined || (paths === null || paths === void 0 ? void 0 : paths.length) === 0)
                return imgs;
            var i = 0;
            const file = new Promise((res, ras) => {
                paths.map((r) => __awaiter(this, void 0, void 0, function* () {
                    const newpath = yield optimizeIMG(r.path);
                    var urlfile = newpath.replace(configRoot_1.dirRoot, configRoot_1.domain);
                    const name = r.fieldname;
                    imgs[name] = urlfile;
                    i++;
                    if (i == paths.length) {
                        res(imgs);
                    }
                }));
            });
            return file;
        }
        catch (error) {
            console.log(error);
            return;
        }
    });
}
exports.getIMGURL = getIMGURL;
function deleteFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.accessSync(path, fs.constants.F_OK);
            fs.rmSync(path);
            return true;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteFile = deleteFile;
function optimizeIMG(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRandom = (new Date().getMilliseconds() * Math.random());
        var nramdom = Math.abs(idRandom).toString().substring(0, 1);
        const ext = Path.extname(path);
        const name = Path.basename(path);
        const dir = path.replace(name, "");
        const newname = dir + (name.replace(ext, "")) + nramdom + ext;
        switch (ext) {
            case ".jpg":
            case ".png":
                console.log("start optimizer");
                yield (0, sharp_1.default)(path)
                    .resize(1024)
                    .withMetadata()
                    .jpeg({ mozjpeg: true, quality: 50 })
                    .toFile(newname, (err, info) => {
                    console.log("Optimizer error: " + err);
                    deleteFile(path);
                });
                console.log("end optimizer ");
                return newname;
            default:
                return path;
                break;
        }
    });
}
exports.optimizeIMG = optimizeIMG;
//# sourceMappingURL=validateImages.js.map