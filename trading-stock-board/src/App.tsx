import './App.css';
import {JSXElementConstructor, Key, ReactElement, ReactFragment, useEffect, useMemo, useState} from "react";

const Cell = ({value}: any) => {
    return (<td className={value < 0 && "text-danger" || ""}>{value}</td>)
}
// const objTemp = {
//     "ethbtc@trade": {
//         "e": "trade",
//         "E": 1667400560859,
//         "s": "ETHBTC",
//         "t": 385588119,
//         "p": "0.07641400",
//         "q": "0.00800000",
//         "b": 3314906938,
//         "a": 3314906916,
//         "T": 1667400560858,
//         "m": false,
//         "M": true
//     },
//     "bnbbtc@trade": {
//         "e": "trade",
//         "E": 1667400556405,
//         "s": "BNBBTC",
//         "t": 207347032,
//         "p": "0.01565100",
//         "q": "2.22300000",
//         "b": 1571945502,
//         "a": 1571945450,
//         "T": 1667400556405,
//         "m": false,
//         "M": true
//     },
//     "ltcbtc@trade": {
//         "e": "trade",
//         "E": 1667400565277,
//         "s": "LTCBTC",
//         "t": 84595726,
//         "p": "0.00304000",
//         "q": "1.60000000",
//         "b": 964840223,
//         "a": 964840220,
//         "T": 1667400565276,
//         "m": false,
//         "M": true
//     },
//     "xmrbtc@trade": {
//         "e": "trade",
//         "E": 1667400548140,
//         "s": "XMRBTC",
//         "t": 44912686,
//         "p": "0.00732300",
//         "q": "0.53500000",
//         "b": 560317340,
//         "a": 560317389,
//         "T": 1667400548140,
//         "m": true,
//         "M": true
//     },
//     "xrpbtc@trade": {
//         "e": "trade",
//         "E": 1667400557298,
//         "s": "XRPBTC",
//         "t": 145690246,
//         "p": "0.00002239",
//         "q": "230.00000000",
//         "b": 1058543871,
//         "a": 1058541791,
//         "T": 1667400557298,
//         "m": false,
//         "M": true
//     },
//     "adabtc@trade": {
//         "e": "trade",
//         "E": 1667400560274,
//         "s": "ADABTC",
//         "t": 115868539,
//         "p": "0.00001934",
//         "q": "2596.60000000",
//         "b": 802352461,
//         "a": 802352091,
//         "T": 1667400560274,
//         "m": false,
//         "M": true
//     },
//     "eosbtc@trade": {
//         "e": "trade",
//         "E": 1667400464201,
//         "s": "EOSBTC",
//         "t": 73289894,
//         "p": "0.00005640",
//         "q": "210.30000000",
//         "b": 699050688,
//         "a": 699050193,
//         "T": 1667400464201,
//         "m": false,
//         "M": true
//     },
//     "dashbtc@trade": {
//         "e": "trade",
//         "E": 1667400494400,
//         "s": "DASHBTC",
//         "t": 26653544,
//         "p": "0.00201300",
//         "q": "0.48900000",
//         "b": 458263055,
//         "a": 458244063,
//         "T": 1667400494400,
//         "m": false,
//         "M": true
//     },
//     "zecbtc@trade": {
//         "e": "trade",
//         "E": 1667400542857,
//         "s": "ZECBTC",
//         "t": 26728361,
//         "p": "0.00247500",
//         "q": "0.28000000",
//         "b": 493996874,
//         "a": 493997154,
//         "T": 1667400542856,
//         "m": true,
//         "M": true
//     },
//     "wavesbtc@trade": {
//         "e": "trade",
//         "E": 1667400505834,
//         "s": "WAVESBTC",
//         "t": 43918361,
//         "p": "0.00015930",
//         "q": "10.69000000",
//         "b": 465327703,
//         "a": 465327711,
//         "T": 1667400505833,
//         "m": true,
//         "M": true
//     },
//     "zilbtc@trade": {
//         "e": "trade",
//         "E": 1667400485393,
//         "s": "ZILBTC",
//         "t": 28397933,
//         "p": "0.00000147",
//         "q": "1020.00000000",
//         "b": 249017166,
//         "a": 248995020,
//         "T": 1667400485393,
//         "m": false,
//         "M": true
//     },
//     "trxbtc@trade": {
//         "e": "trade",
//         "E": 1667400534219,
//         "s": "TRXBTC",
//         "t": 67897249,
//         "p": "0.00000306",
//         "q": "15979.00000000",
//         "b": 550829205,
//         "a": 550829024,
//         "T": 1667400534219,
//         "m": false,
//         "M": true
//     }
// }
function App() {
    const [state, setState] = useState<any>({});
    const [socket, setSocket] = useState<any>(null);


    const streams = [
        "doge",
        "eth",
        "bnb", "waves", "bchabc",
        "bchsv", "xrp", "tusd", "eos",
        "trx", "ltc", "xlm", "bcpt",
        "ada", "zil", "xmr", "strat",
        "zec", "qkc", "neo", "dash", "zrx"
    ];

    const trackedStreams = streams.map(x => `${x}busd@aggTrade`);




    useEffect(() => {
        let ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${trackedStreams.join('/')}`);
        setSocket(ws);

        return () => {

        }
    }, [setSocket]);

    useEffect(() => {

        if (socket) {
            socket.onopen = () => {
                console.log(" connected...");
            };

            socket.onmessage = (evt: any) => {
                const temp = JSON.parse(evt.data);
                console.log(temp);
                setState((previousState: any) => ({
                    ...previousState,
                    ...{[temp.stream]: temp.data}
                }))
            }

        }

    }, [socket])

    const symbols = useMemo(() => {
        return Object.keys(state).map((key) => {
            // @ts-ignore
            return state[key];
        });
    }, [state]);

    return (
        <div className="App">
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Event time</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Buyer order ID</th>
                    <th scope="col">Seller order ID</th>
                    <th scope="col">Trade time</th>
                </tr>
                </thead>
                <tbody>

                {symbols?.map((x: any, idx: number) =>
                    (
                        <tr key={x.s}>
                            <th scope="row">{idx + 1}</th>
                            <td>{x.s}</td>
                            <td>{x.E}</td>
                            <td>{x.p}</td>
                            <td>{x.q}</td>
                            <td>{x.b}</td>
                            <td>{x.a}</td>
                            <td>{x.T}</td>

                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default App;
