"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolders = exports.folderList = void 0;
const configRoot_1 = require("../config/configRoot");
exports.folderList = {
    "files": `${configRoot_1.dirPath}/files`,
    "img": `${configRoot_1.dirPath}/imgs`,
    "post": `${configRoot_1.dirPath}/Post`,
    "story": `${configRoot_1.dirPath}/Story`
};
function createFolders() {
    var fs = require('fs');
    var dirFiles = `${configRoot_1.dirPath}/files`;
    var dirImgs = `${configRoot_1.dirPath}/imgs`;
    const dirPost = `${configRoot_1.dirPath}/Post`;
    console.log("Reading folder structure:");
    Object.keys(exports.folderList).map((key) => {
        var folder = fs.existsSync(exports.folderList[key]);
        if (!folder) {
            fs.mkdirSync(exports.folderList[key], { recursive: true });
            console.log("folder " + key + " created");
        }
        else {
            console.log("folder " + key + " found");
        }
    });
}
exports.createFolders = createFolders;
//# sourceMappingURL=createFolders.js.map