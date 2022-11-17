import {Router} from 'express';
import {  createMedicalRecord, deleteMedicalRecord, getlistbyAID, getfromMID, updateMedicalrecord } from '../controllers/medicalrecord.controller';


const router = Router();


router.post( '/medical/getlistfromaid/:aid', getlistbyAID );
router.post( '/medical/getfrommid/:aid', getfromMID );
router.post( '/medical/new/:aid',createMedicalRecord );
router.put("/medical/update/:aid",updateMedicalrecord);
router.post("/medical/delete/:aid",deleteMedicalRecord);

export default router;