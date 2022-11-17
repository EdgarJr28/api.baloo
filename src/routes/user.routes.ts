import {Router} from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { login, resetPassword, signUp, signUpExt, smsResender, validateSMS } from '../controllers/index.controllers';
import { clearDataUser, deleteUser, getAllUsers, getUsersFirebase, profileImage, updateUserFirebase } from '../controllers/user.controller';
import { storageFiles } from '../libs/uploadsImgs';


const router = Router();
const upload = multer({storage:storageFiles}) 

// router.post('/uploadImage', upload.any(), uploadImage);

router.post("/user/resetpassword",resetPassword);

//new db 
router.get("/users",getAllUsers);
router.post('/user/profileimg', upload.any(), profileImage);
router.post('/user/infoupdate', upload.any(), updateUserFirebase);
router.post('/user/getuser', getUsersFirebase);
router.post('/user/get', getUsersFirebase);
router.post("/user/login",body("email").isEmail(),login)
router.post("/user/signup",signUp);
router.post("/user/signupExt/:type",signUpExt);
router.post("/user/sendsms",smsResender);
router.post("/user/validatesms",validateSMS);
router.post("/user/delete",deleteUser);
router.post("/user/clearDataUser", clearDataUser);


export default router;