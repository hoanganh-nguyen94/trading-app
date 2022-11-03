import {Logger} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import * as WebSocket from "ws";

@WebSocketGateway({
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    private logger = new Logger('EventsGateway');



    afterInit(server: Server): any {
        this.logger.log("Initial EventsGateway");
        const wssEd = `wss://stream.binance.com:9443/stream?streams=btcbusd@aggTrade`;
        // const wssEd = `wss://ws.coincap.io/trades/binance`;

        const ws: any = new WebSocket(wssEd)
        ws.on('open', () => {
            this.logger.log('Connection with binance')
        })
        ws.onmessage = (msg: any) => {
            const message = JSON.parse(msg.data)
            this.server.emit('events', message)
        }
        ws.on('close', () => {
            this.logger.log('Connection closed')
        })
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(`New Connection: ${client.id}`);

    }

    handleDisconnect(client: Socket): any {
        this.logger.log(`Connection ${client.id} is closed`);

    }

}
