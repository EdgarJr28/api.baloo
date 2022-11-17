"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uniqid_1 = __importDefault(require("uniqid"));
const createFolders_1 = require("./createFolders");
const currentDate = new Date();
var fs = require('fs');
exports.storageFiles = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        switch (file.fieldname) {
            case "pedigreeFile":
                cb(null, createFolders_1.folderList.files);
                break;
            case "imgProfile":
            case "img":
            case "image":
            case "imgURL":
                cb(null, createFolders_1.folderList.img);
                break;
            case "multimedia":
                cb(null, createFolders_1.folderList.post);
                break;
            case "storymedia":
                cb(null, createFolders_1.folderList.story);
                break;
        }
    },
    filename: (req, file, cb) => {
        const body = req.body;
        var id = (body === null || body === void 0 ? void 0 : body.uid) || (body === null || body === void 0 ? void 0 : body.aid) || (body === null || body === void 0 ? void 0 : body.sid);
        var uid = (0, uniqid_1.default)();
        var idRandom = (currentDate.getMilliseconds() * Math.random());
        idRandom = Math.abs(idRandom).toString().substring(0, 1);
        if (file.fieldname) {
            idRandom = "-" + uid;
        }
        var name = file.fieldname + "-" + (id || uid) + idRandom + path_1.default.extname(file.originalname);
        cb(null, name);
    }
});
function errr(a) {
    console.log(a);
}
//# sourceMappingURL=uploadsImgs.js.map