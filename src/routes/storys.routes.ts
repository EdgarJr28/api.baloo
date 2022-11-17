import {request, response, Router} from 'express';
import multer from 'multer';
import { createStory, deleteStory, getStorysList, getStorysByProfileID, MediaServer } from '../controllers/storys.controllers';
import { storageFiles } from '../libs/uploadsImgs';


const router = Router();
const upload = multer({storage:storageFiles}) 
router.get("/media",MediaServer);
router.post("/story/new",upload.any(),createStory);
router.post("/story/delete",deleteStory);
router.post('/story', getStorysList);
router.post("/story/profile",getStorysByProfileID);
// router.post("/story/get",getStoryList);
// router.post('/story/',upload.any(), createStory);
// router.post('/getstory/', getStory);
// router.delete('/deletestory/', deleteStory);
// router.post('/getStorysByAnimalId/', getStorysByAnimalId);
// router.post('/getStorysAnimalFollowed/', storysAnimalFollowed);

export default router;