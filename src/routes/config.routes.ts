import {request, response, Router} from 'express';
import multer from 'multer';
import { newColumnTypeHome } from '../controllers/configs/config.controllers';
import { storageFiles } from '../libs/uploadsImgs';

const router = Router();
const upload = multer({storage:storageFiles}) 

//news routes
router.post('/config/columnType', newColumnTypeHome);


export default router;