const twilioClient = require('./twilioClient');
const admins = require('./config/administrators.json');

exports.notifyOnOutage = function() {
    admins.forEach(function(admin) {
        var messageToSend = 'The hotspot is down!';
        twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
}

exports.notifyDailyActivity = function(reward24, reward30, priceHNT) {
    admins.forEach(function(admin) {
        var messageToSend = 'Daily Stats:\n24Hr: ' + Math.round(reward24) + '\n30Day: ' + Math.round(reward30);

        if (!isNaN(priceHNT) && priceHNT > 0) {
            messageToSend += '\nPrice: $' + priceHNT + '\n\nFULL Value:\n24Hr: $' + Math.round(reward24 * priceHNT * 100) / 100 + '\n30Day: $' + Math.round(reward30 * priceHNT * 100) / 100;
            messageToSend += '\n\nSHARE Value:\n24Hr: $' + Math.round((reward24 * 0.2) * priceHNT * 100) / 100 + '\n30Day: $' + Math.round((reward30 * 0.2) * priceHNT * 100) / 100;
        }
        
        twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
}