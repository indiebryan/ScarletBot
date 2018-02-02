/*
*   rh.js
*   Contains calls to Robinhood API using Axios functionality
*/

//Use Robinhood calls stored in local rh.js
require('./rh')();

//Use CoinMarketCap calls stored in local cmc.js
require('./cmc')();

//Load bot token & config properties
const config = require("./config.json");

const Discord = require("discord.js"); 
const bot = new Discord.Client();

//Emoji symbols
var emoji_stockup;
var emoji_stockdown;

//Define filestream
var fs = require('fs');

//Declare watchlist
var watchlist = '';

// Called when the bot first runs
bot.on("ready", function() {
    console.log("Bot started. Listening on " + bot.channels.length + " channels");
    console.log("-----");

    //Load emoji
    emoji_stockup = bot.emojis.find("name", "stock_up");
    emoji_stockdown = bot.emojis.find("name", "stock_down");

    //Load watchlist to var
    loadWatchlist();
});

// Checks each message for a command (set to async to allow axios functionality from rh.js)
bot.on("message", async function(message){

        //Quote stock
        if (message.content.substr(0, 6) === "!quote") {
            const [_, symbol] = message.content.split(' ');

            //Pass stock symbol to rh.js and retrieve quote data
            let response = await getQuote(symbol);

            //Add emoji flavor
            response = formatQuote(response);

            message.reply(response);
        }

        //Quote coin
        if (message.content.substr(0, 7) === "!crypto") {
            const [_, symbol] = message.content.split(' ');

            //Pass coin symbol or name to cmc.js and retrieve quote data
            let response = await getCrypto(symbol);
            
            response = formatQuote(response);

            message.reply(response);
        }

        //TODO: Allow users to have separate watchlists
        //Add stock to watchlist
        if (message.content.substr(0, 6) === "!watch") {
            const [_, symbol] = message.content.split(' ');

            //If watchlist is empty, put on first line.  Otherwise, return to next line before appending
            if (watchlist == null)
                fs.appendFileSync(config.watchlist, symbol.toUpperCase() + ' 1');
            else
                fs.appendFileSync(config.watchlist, '\n' + symbol.toUpperCase() + ' 1');

            //Reload watchlist
            loadWatchlist();

            message.reply(symbol.toUpperCase() + ' has been added to the watchlist.');
        }

        //Remove stock from watchlist
        if (message.content.substr(0, 8) === "!unwatch") {
            const [_, symbol] = message.content.split(' ');

            //Initialize new list var which will hold contents of watchlist less the removed symbol
            let newList = '';

            //Find index of symbol on watchlist
            let index = watchlist.indexOf(symbol.toUpperCase() + ' 1');

            //If symbol is found, remove it from the array and set new list equal to array joined by \n
            if (index > -1) {
                console.log('index: ' + index);
                watchlist.splice(index, 1);
                newList = watchlist.join('\n');

                //Overwrite watchlist file with new list
                await fs.writeFile(config.watchlist, newList, function(error) {
                    if (error) throw error;
                });

                //Alert user that symbol is now unwatched
                message.reply(symbol.toUpperCase() + ' has been removed from the watchlist.');
            } else {
                message.reply(symbol.toUpperCase() + ' could not be found on the watchlist.');
            }

            //Reload watchlist
            loadWatchlist();

            
        }

        //Print watchlist
        if (message.content.substr(0, 5) === "!list") {

            //Check if list is empty
            if (watchlist == null || watchlist.length == 0)
                message.reply('The watchlist is currently empty.');
            else {
                //Start response on new line for formatting purposes
                let response = '\n';

                //Loop through watchlist and collect & format quotes for each symbol and add to response
                for (var i = 0; i < watchlist.length; i++)
                response += formatQuote(await getQuote(watchlist[i].split(' ')[0])) + '\n';

                message.reply(response);
            }

        }
});

//Add stock_up or stock_down emoji surrounding quotes
function formatQuote(quote) {

    //Add emoji flavor
    if (quote[1] == 'up') 
        quote[0] = emoji_stockup + quote[0] + emoji_stockup;
    else
        quote[0] = emoji_stockdown + quote[0] + emoji_stockdown;

    return quote[0];
}

//(Re)Load watchlist from local file
function loadWatchlist() {
    fs.readFile(config.watchlist, function(err, buf) {
        
        if (buf != '') {
            var data = buf.toString();
            var rows = data.replace(/[\r]+/g, '').split('\n');
            watchlist = rows;
        } else {
            console.log('Watchlist not found or is empty.');
            watchlist = null;
        }
      });
}

// When the bot gets dc/d
bot.on('disconnected', function () {
    console.log('Disconnected.');
    process.exit(1);
});

// Login to discord using credentials set in config
bot.login(config.token);
