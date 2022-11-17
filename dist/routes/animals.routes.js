"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const animals_controllers_1 = require("../controllers/animals.controllers");
const uploadsImgs_1 = require("../libs/uploadsImgs");
const router = (0, express_1.Router)();
const saveToDisk = (0, multer_1.default)({ storage: uploadsImgs_1.storageFiles });
const buffer = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/animal', animals_controllers_1.getAllAnimals);
router.post('/animal/new', saveToDisk.any(), animals_controllers_1.newAnimal);
router.put('/animal/updateinfo', saveToDisk.any(), animals_controllers_1.updateAnimal);
router.post('/animal/imgProfile', saveToDisk.any(), animals_controllers_1.AnimalprofileImage);
router.post('/animal/getfromuser', animals_controllers_1.getAnimalsFromUser);
router.post('/animal/delete', animals_controllers_1.deleteAnimalsById);
router.post('/animal/getbyaid', animals_controllers_1.getAnimalByIDRoute);
router.post("/animal/setpedigree", saveToDisk.any(), animals_controllers_1.pedigreeUpdate);
router.post('/animal/dblist', animals_controllers_1.getAnimalsTypesFirebase);
router.post('/animal/dbspecie', animals_controllers_1.getAnimalsTypesFirebase);
router.post('/animal/follow', animals_controllers_1.follow);
router.post("/animal/saveConfigMatch", animals_controllers_1.saveConfigMatch);
router.post("/animal/updateConfigMatch", animals_controllers_1.editConfigMatch);
router.post("/animal/getConfigMatch", animals_controllers_1.getConfigMatch);
exports.default = router;
//# sourceMappingURL=animals.routes.js.map