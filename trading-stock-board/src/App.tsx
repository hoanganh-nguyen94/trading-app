import './App.css';
import {JSXElementConstructor, Key, ReactElement, ReactFragment, useEffect, useMemo, useState} from "react";

const Cell = ({value}: any) => {
    return (<td className={value < 0 && "text-danger" || ""}>{value}</td>)
}

function App() {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        let eventSource = new EventSource('http://localhost:3005/sse');
        eventSource.onmessage = ({data}) => {
            setState(JSON.parse(data));
        }
    }, []);

    const symbols = useMemo(() => {
        return state?.symbols
    }, [state]);

    return (
        <div className="App">
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">open</th>
                    <th scope="col">close</th>
                    <th scope="col">high</th>
                    <th scope="col">low</th>
                    <th scope="col">volume</th>
                </tr>
                </thead>
                <tbody>

                {symbols?.map((x: any, idx: number) =>
                    (
                        <tr key={x}>
                            <th scope="row">{idx + 1}</th>
                            <td>{x}</td>
                            <Cell value={state.stockPrices[idx]?.open}/>
                            <Cell value={state.stockPrices[idx]?.close}/>
                            <Cell value={state.stockPrices[idx]?.high}/>
                            <Cell value={state.stockPrices[idx]?.low}/>
                            <Cell value={state.stockPrices[idx]?.volume}/>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default App;
