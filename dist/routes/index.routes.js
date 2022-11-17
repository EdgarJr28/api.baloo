"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG = void 0;
const express_1 = require("express");
const index_controllers_1 = require("../controllers/index.controllers");
const MediaReturn_1 = require("../libs/MediaReturn");
exports.DEBUG = true;
const router = (0, express_1.Router)();
router.get('/api', index_controllers_1.indexWelcome);
router.post('/resendSMS', index_controllers_1.smsResender);
router.post('/deletesms/', index_controllers_1.removeSMS);
router.get("/api/debug/", index_controllers_1.setDebug);
router.get("/api/createanimals", index_controllers_1.createDBAnimalsTypes);
router.post("/timeout/return", MediaReturn_1.mediaReturn);
exports.default = router;
//# sourceMappingURL=index.routes.js.map