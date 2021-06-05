const twilioNotification = require('./twilioNotification');
const cron = require('cron');
const axios = require('axios');
const config = require('./config');

var job = new cron.CronJob('0 */10 * * * *', async () => {
    try {
        const resp = await axios.get('https://api.helium.io/v1/hotspots/name/' + config.hotspotName);

        if (resp.data.data[0].status.online && resp.data.data[0].status.online != 'online') {
            twilioNotification.notifyOnOutage();
        }
    } catch (error) {
        console.log(error);
    }
}, null, true, 'America/New_York');

job.start();