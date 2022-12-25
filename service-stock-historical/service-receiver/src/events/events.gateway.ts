import {Logger} from '@nestjs/common';
import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer, WsResponse
} from "@nestjs/websockets";
import {io} from "socket.io-client";
import {Server, Socket} from "socket.io";
import {from, map, Observable} from "rxjs";



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

    @SubscribeMessage('events')
    findAll(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket): Observable<WsResponse<number>> {
        this.logger.log(data)
        this.logger.log(client.id)
        return from([1, 2, 3]).pipe(map(item => ({event: 'events', data: item})));
    }

    afterInit(server: Server): any {
        this.logger.log("Initial EventsGateway");
        const URL_PROVIDER = process.env.URL_DATA_PROVIDER;
        const URL_PROPAGATOR = process.env.URL_DATA_PROPAGATOR;

        this.logger.log(`Provider URL: ${URL_PROVIDER}`);

        const socketProvider = io(URL_PROVIDER);
        socketProvider.on('connect', () => {
            this.logger.log('Connection with binance')
            this.logger.log('Emit all data')
            socketProvider.emit('trading_event', {data: "*"});

        })

        this.logger.log(`Propagator URL: ${URL_PROVIDER}`);
        const socketPropagator = io(URL_PROPAGATOR);
        socketPropagator.on('connect', () => {
            this.logger.log('Connection with Propagator')
        })

        socketProvider.on('my_response', (msg) => {
            this.logger.log("received data from provider: " + msg)
            socketPropagator.emit('events', msg)
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
