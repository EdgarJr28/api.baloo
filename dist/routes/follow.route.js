"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_1 = require("../controllers/follow");
const router = (0, express_1.Router)();
router.post("/follow", follow_1.setfollow);
exports.default = router;
//# sourceMappingURL=follow.route.js.map