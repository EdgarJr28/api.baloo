"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const tokenValidation = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token)
            return res.status(401).json({ ok: false, status: 'ACCESS DENIED' });
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET || config_1.default.SECRET);
        console.log(payload);
        req.userId = payload.id;
        next();
    }
    catch (e) {
        console.log(e.message);
        return res.status(401).json({ ok: false, status: 'ACCESS DENIED' });
    }
};
exports.tokenValidation = tokenValidation;
//# sourceMappingURL=validateToken.js.map