# ScarletBot
A Discord bot which interfaces with Robinhood API and CoinMarketCap API in order to provide real time quotes with added functionality such as watchlists.

Written by Bryan C from [IndieProgrammer.com](http://indieprogrammer.com/), [Youtube.com/IndieProgrammer](https://www.youtube.com/user/IndieProgrammer)

![alt text](https://i.imgur.com/1tIHGTL.png "Scarlet Bot Example Image")

## Features / Commands
- Type `!quote SYMBOL` to get a real time stock quote using Robinhood's API
- Type `!crypto SYMBOL` or `!crypto NAME` to get a real time cryptocurrency quote using CoinMarketCap's API
- Type `!list` to print quotes for each stock on your watchlist
- Type `!watch SYMBOL` to add a stock to your watchlist
- Type `!unwatch SYMBOL` to remove a stock from your watchlist

## Known Issues / TODO
- Requesting a quote for a stock that doesn't exist will cause an error with no message to the user
- Requesting a quote for a cryptocurrency that doesn't exist will cause an error with no message to the user
- Stocks that do not exist can be added to your watchlist, which will cause an error when the `!list` command is used

## Waiver
At this stage, the code in this repository likely contains many flaws, both known and unknown.  The code presented here is purely for educational purposes.
