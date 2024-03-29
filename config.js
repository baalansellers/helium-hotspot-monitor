var dotenv = require('dotenv');
var cfg = {};

dotenv.config({path: '.env'});

// Get the Twilio account SID and auth token here:
// https://www.twilio.com/user/account
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];

var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

cfg.hotspotAddress = process.env.HOTSPOT_ADDRESS;
cfg.hotspotName = process.env.HOTSPOT_NAME;

module.exports = cfg;