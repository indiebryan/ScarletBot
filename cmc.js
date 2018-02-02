/*
*   cmc.js
*   Contains calls to CoinMarketCap API using Axios functionality
*/

const axios = require('axios');

module.exports = function() { 

    //Return array [Formatted quote string, 'up' or 'down']
    this.getCrypto = async function(symbol) {
        var response = 'ERROR: Coin ' + symbol + ' not found.';
        let coindata_bulk = await axios.get('https://api.coinmarketcap.com/v1/ticker/');

        console.log(coindata_bulk);

        var coinInfo = coindata_bulk.data;

        var coinSelected = -1;

        for (var i = 0; i < coinInfo.length; i++) {
            if (coinInfo[i].id.toUpperCase() == symbol.toUpperCase() || coinInfo[i].symbol.toUpperCase() == symbol.toUpperCase()) {
                coinSelected = i;
                break;
            }
        }

        if (coinSelected != -1) {

            let c_name = coinInfo[coinSelected].name;
            let c_last = coinInfo[coinSelected].price_usd;
            let c_percent = coinInfo[coinSelected].percent_change_24h;

            let c_direction = 'up';
            if (c_percent < 0) c_direction = 'down';

            //Set response equal to formatted string with inserted data
            response = [c_name + ' | ' + 'Last: $' + c_last + ' | ' + 'Change 24h: ' + c_percent + '%', c_direction];
        }

        return response;
    };
}