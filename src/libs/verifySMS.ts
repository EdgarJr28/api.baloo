export function verifySMS() {
  var phoneToken = require('generate-sms-verification-code')
  try {
    var generatedSMS = phoneToken(4, { type: 'string' })
    return generatedSMS
  } catch (error) {
    console.log("SMS Error")
  }

}