const axios = require('axios');
const twilioNotification = require('./twilioNotification');
const cron = require('cron');
const config = require('./config');

function getDateString(adjustDays) {
    adjustDays = isNaN(adjustDays) ? 0 : adjustDays;

    var currentDate = new Date();
    
    currentDate.setDate(currentDate.getDate() + adjustDays);

    return currentDate.toISOString();
}

var job = new cron.CronJob('00 00 08 * * *', async () => {
    var last24Hours = 0;
    var last30Days = 0;
    var priceHNT = 0;
    var rewardScale = 0;
    var gain = 0;
    var status = "unknown";

    try {
        const response24 = await axios.get('https://api.helium.io/v1/hotspots/' + config.hotspotAddress + '/rewards/sum?max_time=' + getDateString(-1) + '&min_time=' + getDateString(-2));
        const response30 = await axios.get('https://api.helium.io/v1/hotspots/' + config.hotspotAddress + '/rewards/sum?max_time=' + getDateString() + '&min_time=' + getDateString(-30));
        const responsePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=HNTUSDT');
        const respStatus = await axios.get('https://api.helium.io/v1/hotspots/name/' + config.hotspotName);

        if (response24.data.data) {
            last24Hours = response24.data.data.total;
        }

        if (response30.data.data) {
            last30Days = response30.data.data.total;
        }

        if (responsePrice.data.price) {
            priceHNT = Math.round(responsePrice.data.price * 1000) / 1000;
        }

        if (respStatus.data.data[0].reward_scale) {
            rewardScale = respStatus.data.data[0].reward_scale;
        }

        if (respStatus.data.data[0].gain) {
            gain = respStatus.data.data[0].gain;
        }

        if (respStatus.data.data[0].status.online) {
            status = respStatus.data.data[0].status.online;
        }

        twilioNotification.notifyDailyActivity(last24Hours, last30Days, priceHNT, rewardScale, gain, status);
    } catch (error) {
        console.log(error);
    }
}, null, true, 'America/New_York');

job.start();