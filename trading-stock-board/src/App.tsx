import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import internal from "stream";

function App() {
    const socket = io('http://localhost:3000', {
        query: {
            token: '123',
        },
    })

    useEffect(() => {
        console.dir(socket)
        socket.on('connect', () => {
            console.log('Connected');
        });
        socket.emit('events', { event: 'events', data: { test: true } });
        socket.on('events', (response) => {
            console.log(response);
        });
    }, []);

    const fireData = () => {
        socket.emit('events', { event: 'events', data: { test: true } });

    }
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <button onClick={() => fireData()}>aihi</button>
            </header>
        </div>
    );
}

export default App;
