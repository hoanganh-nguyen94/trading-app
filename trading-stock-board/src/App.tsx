import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';

function App() {
    const  socket = io("http://localhost:3000")

    useEffect(() => {
        console.dir(socket)
        socket.on('connect', () => {
            console.log('Connected');
        });


        socket.on('events', function(data) {
            console.log('event', data);
        });

        // dispatch(loadInitialDataSocket(socket))

    }, []);

    const fireData = () => {
        socket.emit('events', { test: 'test' });
    }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
<button onClick={fireData}>aihi</button>
      </header>
    </div>
  );
}

export default App;
