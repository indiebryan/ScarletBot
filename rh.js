/*
*   rh.js
*   Contains calls to Robinhood API using Axios functionality
*/

const axios = require('axios');

module.exports = function() { 
    
    //Return array [Formatted quote string, 'up' or 'down']
    this.getQuote = async function(symbol) {
        var response = 'ERROR';

        let rhdata_quotes = await axios.get(`https://api.robinhood.com/quotes/${symbol.toUpperCase()}/`);
        let rhdata_fundamentals = await axios.get(`https://api.robinhood.com/fundamentals/${symbol.toUpperCase()}/`);
        let instrument_URL = rhdata_fundamentals.data.instrument;
        let rhdata_instrument = await axios.get(instrument_URL);

        //Store symbol name
        let s_name = rhdata_instrument.data.simple_name;

        //If derivative does not have a full name, use the capitalized symbol instead
        if (s_name == null) s_name = symbol.toUpperCase();

        //Store symbol open price
        let s_open = rhdata_quotes.data.previous_close;

        //TODO: May need to change if this only looks at EH even when market is open
        let s_last = rhdata_quotes.data.last_trade_price;

        //Calculate day's % change
        let s_percent = ((1 - s_open / s_last) * 100).toFixed(2) + '%';

        //Determine if stock is up or down from open and pass as the 2nd value in response array
        let s_direction = 'up';
        if (s_last < s_open) s_direction = 'down';

        //Set response equal to formatted string with inserted data
        response = [s_name + ' | ' + 'Last: ' + s_last + ' | ' + 'Change: ' + (s_last - s_open).toFixed(2) + ' (' + s_percent + ')', s_direction];

        return response;
    };

    //TODO: Create boolean function to verify if symbol is a real stock
    this.verifyStock = async function(symbol) {
        return true;
    };

}