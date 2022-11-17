"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminPanel_1 = require("../controllers/adminPanel");
const router = (0, express_1.Router)();
router.post("/admin/login", adminPanel_1.loginAdmin);
router.post("/admin/signup", adminPanel_1.signupAdmin);
router.post("/admin/users", adminPanel_1.getAdminUserList);
router.post("/admin/getuser", adminPanel_1.getuserinfo);
router.put("/admin/user", adminPanel_1.updateAdminUserData);
router.post("/admin/user/del", adminPanel_1.deleteAdminUser);
exports.default = router;
//# sourceMappingURL=adminPanel.routes.js.map