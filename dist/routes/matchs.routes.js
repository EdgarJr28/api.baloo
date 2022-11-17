"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchs_controller_1 = require("../controllers/matchs.controller");
const router = (0, express_1.Router)();
router.post('/match/new', matchs_controller_1.sendMatch);
router.post('/match/findMatch/', matchs_controller_1.getMatchProfiles);
exports.default = router;
//# sourceMappingURL=matchs.routes.js.map