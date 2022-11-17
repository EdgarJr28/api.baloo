"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySMS = void 0;
function verifySMS() {
    var phoneToken = require('generate-sms-verification-code');
    try {
        var generatedSMS = phoneToken(4, { type: 'string' });
        return generatedSMS;
    }
    catch (error) {
        console.log("SMS Error");
    }
}
exports.verifySMS = verifySMS;
//# sourceMappingURL=verifySMS.js.map