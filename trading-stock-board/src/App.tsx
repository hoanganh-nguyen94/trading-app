import './App.css';
import {JSXElementConstructor, Key, ReactElement, ReactFragment, useEffect, useMemo, useState} from "react";
import format from 'date-fns/format';
import * as WebSocket from "ws";
import {io} from 'socket.io-client';

const Cell = ({value}: any) => {
    return (<td className={value < 0 && "text-danger" || ""}>{value}</td>)
}

function App() {
    const [state, setState] = useState<any>([]);
    const [socket, setSocket] = useState<any>(null);


    useEffect(() => {
        let ws = io('ws://localhost:3000', {transports: ['websocket', 'polling']})
        setSocket(ws);


        return () => {

        }
    }, [setSocket]);

    useEffect(() => {
        if (socket) {
            socket?.emit('events', {test: 'test'})
            socket.onopen = () => {
                console.log(" connected...");
            };
            socket.on('events', (data: any) => {
                setState((previousState: any) => {

                    return [{...data?.data,}, ...previousState];
                })
            });


        }

    }, [socket])


    const symbols = useMemo(() => {
        console.log(state);
        return state.map((x: any) => ({...x, timeTrade: format(x?.E, "HH:mm:ss.SSS")}));
    }, [state]);


    const time = new Date().getTime();
    return (
        <div className="App">
            <h1>{time}</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Trade time</th>
                </tr>
                </thead>
                <tbody>

                {symbols?.map((x: any, idx: number) =>
                    (
                        <tr key={idx}>
                            <th scope="row">{idx + 1}</th>
                            <td>{x.p}</td>
                            <td>{x.q}</td>
                            <td>{x.timeTrade}</td>

                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default App;
