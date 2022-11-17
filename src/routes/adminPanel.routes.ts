import { Router } from "express";
import { deleteAdminUser, getAdminUserList, getuserinfo, loginAdmin, signupAdmin, updateAdminUserData } from "../controllers/adminPanel";

const router=Router();

router.post("/admin/login",loginAdmin);
router.post("/admin/signup",signupAdmin);
router.post("/admin/users",getAdminUserList);
router.post("/admin/getuser",getuserinfo);
router.put("/admin/user",updateAdminUserData);
router.post("/admin/user/del",deleteAdminUser);


export default router;