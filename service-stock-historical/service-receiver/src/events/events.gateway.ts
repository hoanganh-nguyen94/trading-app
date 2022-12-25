import {Logger} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {io} from "socket.io-client";
import {Server, Socket} from "socket.io";



@WebSocketGateway({
    transports: ['websocketProvider', 'polling'],
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
        // const wssEd = `wss://stream.binance.com:9443/stream?streams=btcbusd@aggTrade`;
        // const wssEd = `wss://ws.coincap.io/trades/binance`;
        const URL_PROVIDER = process.env.URL_DATA_PROVIDER;
        this.logger.log(`Provider URL: ${URL_PROVIDER}`);
        const socketProvider = io(URL_PROVIDER);
        socketProvider.on('connect', () => {
            this.logger.log('Connection with binance')
            this.logger.log('Emit all data')
            socketProvider.emit('trading_event', {data: "*"});

        })
        socketProvider.on('my_response', (msg) => {
            this.logger.log(msg);
            // this.server.emit('events', message)
        })


        socketProvider.on('close', () => {
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
