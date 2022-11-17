import { request, response, Router } from 'express';
import multer from 'multer';
import { deleteAnimalsById, getAnimalsFirebase, newAnimal, getAnimalsFromUser, getAnimalsTypesFirebase, getAnimalByIDRoute, updateAnimal, AnimalprofileImage, follow, getAllAnimals, pedigreeUpdate, saveConfigMatch, getConfigMatch, editConfigMatch } from '../controllers/animals.controllers';

import { storageFiles } from '../libs/uploadsImgs';

const router = Router();
const saveToDisk = multer({ storage: storageFiles });
const buffer = multer({ storage: multer.memoryStorage() });


router.post('/animal', getAllAnimals);
router.post('/animal/new', saveToDisk.any(), newAnimal);
router.put('/animal/updateinfo', saveToDisk.any(), updateAnimal);
router.post('/animal/imgProfile', saveToDisk.any(), AnimalprofileImage);
router.post('/animal/getfromuser', getAnimalsFromUser);
router.post('/animal/delete', deleteAnimalsById);
router.post('/animal/getbyaid', getAnimalByIDRoute);
router.post("/animal/setpedigree", saveToDisk.any(), pedigreeUpdate);
router.post('/animal/dblist', getAnimalsTypesFirebase);
router.post('/animal/dbspecie', getAnimalsTypesFirebase);
router.post('/animal/follow', follow);
router.post("/animal/saveConfigMatch", saveConfigMatch);
router.post("/animal/updateConfigMatch", editConfigMatch);
router.post("/animal/getConfigMatch", getConfigMatch);

export default router;