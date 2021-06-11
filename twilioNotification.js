const twilioClient = require('./twilioClient');
const admins = require('./config/administrators.json');

exports.notifyOnOutage = function() {
    admins.forEach(function(admin) {
        var messageToSend = 'The hotspot is down!';
        twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
}

exports.notifyDailyActivity = function(reward24, reward30, priceHNT, rewardScale, gain, status) {
    admins.forEach(function(admin) {
        var messageToSend = 'Hotspot Status: ' + status + '.\n';

        messageToSend += 'Reward Scale: ' + rewardScale + '.\n';
        messageToSend += 'Gain: ' + gain + '.\n';
        
        messageToSend += '\nDaily Stats\n'
        messageToSend += '24-Hour: ' + Math.round(reward24) + '.\n';
        messageToSend += '30-Day: ' + Math.round(reward30) + '.';

        if (!isNaN(priceHNT) && priceHNT > 0) {
            messageToSend += '\nPrice: $' + priceHNT + '.\n\nFull Value:\n24-Hour: $' + Math.round(reward24 * priceHNT * 100) / 100 + '.\n30-Day: $' + Math.round(reward30 * priceHNT * 100) / 100 + '.';
            messageToSend += '\n\nShare Value\n24-Hour: $' + Math.round((reward24 * 0.2) * priceHNT * 100) / 100 + '.\n30-Day: $' + Math.round((reward30 * 0.2) * priceHNT * 100) / 100 + '.';
        }
        
        twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
}

exports.notifyPriceDfiHigh = (price) => {
    admins.forEach((admin) => {
        twilioClient.sendSms(admin.phoneNumber, 'DFI Price is High @ $' + price);
    })
}

exports.notifyPriceDfiLow = (price) => {
    admins.forEach((admin) => {
        twilioClient.sendSms(admin.phoneNumber, 'DFI Price is Low @ $' + price);
    })
}