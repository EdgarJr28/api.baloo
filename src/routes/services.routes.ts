import {request, response, Router} from 'express';
import { createService, deleteService, getService, getServiceByUserId, getServiceList, updateService } from '../controllers/services.controllers';
import {  storageFiles } from '../libs/uploadsImgs';
import multer from 'multer';


const router = Router();
const upload = multer({storage:storageFiles}) 


//new struct
router.post( '/service/new', upload.any(),createService );
router.post( '/service/update', upload.any(), updateService );
router.post('/service/getByUserID/', getServiceByUserId);
router.post('/service/get', getService);
router.post( '/service/delete', deleteService );
router.post("/service/getlist",getServiceList);
export default router;




