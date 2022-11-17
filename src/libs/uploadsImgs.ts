import multer from 'multer';
import path from 'path'
import { dirPath } from '../config/configRoot'
import uniqid from 'uniqid';
import { folderList } from './createFolders';
import sharp from "sharp";

const currentDate = new Date();
var fs = require('fs');



export const storageFiles = multer.diskStorage({

  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "pedigreeFile":
        cb(null, folderList.files);
        break;
      case "imgProfile":
      case "img":
      case "image":
      case "imgURL":
        cb(null, folderList.img)
        break;
      case "multimedia":
        cb(null, folderList.post);
        break;
      case "storymedia":
        cb(null, folderList.story);
        break;
    }
  },
  filename: (req, file, cb) => {
    const body = req.body;
    var id = body?.uid || body?.aid || body?.sid;
    var uid = uniqid();
    var idRandom: any = (currentDate.getMilliseconds() * Math.random());
    idRandom = Math.abs(idRandom).toString().substring(0, 1);
    if (file.fieldname) {
      idRandom = "-" + uid
    }

    var name = file.fieldname + "-" + (id || uid) + idRandom + path.extname(file.originalname);

    cb(null, name);
  }
})

function errr(a: any) {
  console.log(a);
}