"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalrecord_controller_1 = require("../controllers/medicalrecord.controller");
const router = (0, express_1.Router)();
router.post('/medical/getlistfromaid/:aid', medicalrecord_controller_1.getlistbyAID);
router.post('/medical/getfrommid/:aid', medicalrecord_controller_1.getfromMID);
router.post('/medical/new/:aid', medicalrecord_controller_1.createMedicalRecord);
router.put("/medical/update/:aid", medicalrecord_controller_1.updateMedicalrecord);
router.post("/medical/delete/:aid", medicalrecord_controller_1.deleteMedicalRecord);
exports.default = router;
//# sourceMappingURL=medicalRecord.routes.js.map