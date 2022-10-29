import './App.css';
import {useEffect, useMemo, useState} from "react";
import { io, Socket } from 'socket.io-client';
function App() {

    const socket = io("http://localhost:3000", );
    useEffect(() => {

        socket.on('connect', function() {
            console.log('Connected');

            socket.emit('events', { test: 'test' });
            socket.emit('identity', 0, response =>
                console.log('Identity:', response),
            );
        });
        socket.on('events', function(data) {
            console.log('event', data);
        });
        socket.on('exception', function(data) {
            console.log('event', data);
        });
        socket.on('disconnect', function() {
            console.log('Disconnected');
        });

    }, []);



    return (
        <div className="App">
        </div>
    );
}

export default App;
