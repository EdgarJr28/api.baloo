"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCoins = void 0;
const middleware_axios_1 = require("middleware-axios");
exports.apiCoins = (0, middleware_axios_1.create)({
    baseURL: "https://api.coinbase.com/v2/"
});
//# sourceMappingURL=serverCoins.js.map