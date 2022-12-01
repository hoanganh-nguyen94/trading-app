let WebSocketServer = require('ws').Server
let fs = require("fs")

let stocks
try {
    stocks = JSON.parse(fs.readFileSync("stocks.json"))
    console.log("Successfully loaded stocks data.")

} catch {
    throw Error("Could not load stocks data.")
}
let stockSymbols = stocks.map(stock => stock.symbol)
console.log(`Supported stock symbols: ${stockSymbols}`)

let wss = new WebSocketServer({port: 8080})
console.log("WebSocket server is listening on port 8080.")
