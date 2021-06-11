const twilioNotification = require('./twilioNotification');
const cron = require('cron');
const axios = require('axios');
const config = require('./config');

var debounceLow = 0;
var debounceHigh = 0;

function getDfiPrice(tickers) {
    tickers.forEach(ticker => {
        if( ticker.base == "DFI" && ticker.target == 'BTC') {
            return ticker.converted_last.usd;
        }
    })
}

var job = new cron.CronJob('0 */10 * * * *', async () => {
    try {
        const respHotspot = await axios.get('https://api.helium.io/v1/hotspots/name/' + config.hotspotName);
        const respDfiTicker = await axios.get('https://api.coingecko.com/api/v3/coins/defichain/tickers');

        if (respHotspot.data.data[0].status.online && respHotspot.data.data[0].status.online != 'online') {
            twilioNotification.notifyOnOutage();
        }

        if (respDfiTicker.data.tickers) {
            var currPrice = getDfiPrice(respDfiTicker.data.ticker);

            if (debounceHigh > 0) {
                debounceHigh--;
            }

            if (debounceLow > 0 ) {
                debounceLow--;
            }

            if (debounceHigh <= 0 && currPrice > 4.0) {
                twilioNotification.notifyPriceDfiHigh(currPrice);
                debounceHigh = 100;
            }

            if (debounceLow <= 0 && currPrice < 3.0) {
                twilioNotification.notifyPriceDfiLow(currPrice);
                debounceLow = 100;
            }
        }
    } catch (error) {
        console.log(error);
    }
}, null, true, 'America/New_York');

job.start();