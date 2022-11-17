// Create Folders Init
import { dirPath, dirRoot } from "../config/configRoot";

export var folderList ={
    "files":`${dirPath}/files`,
    "img":`${dirPath}/imgs`,
    "post":`${dirPath}/Post`,
    "story":`${dirPath}/Story`
}
export function createFolders () {
    var fs = require('fs');
    var dirFiles = `${dirPath}/files`;
    var dirImgs =  `${dirPath}/imgs`;
    const dirPost = `${dirPath}/Post`;

    console.log("Reading folder structure:");
    
   Object.keys(folderList).map((key:any)=>{

    var folder = fs.existsSync(folderList[key]);
    
    if (!folder) {
            fs.mkdirSync(folderList[key],{recursive:true});
            console.log("folder " + key + " created");
        } else {
            console.log("folder " + key + " found");
            
        }
    
   })

    
}