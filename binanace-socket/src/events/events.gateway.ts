import {Logger} from '@nestjs/common';
import {
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import {from, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
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

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        this.logger.log(data);
        return this.getCryptoData()
            .pipe(tap(c => {
                this.server.emit('events', c)

            }), map((c) => {

                return c
            }))
    }


    getCryptoData(): any {
        const stream$ = new Observable((observer) => {
            const wssEd = `wss://stream.binance.com:9443/stream?streams=btcbusd@aggTrade`;
            // const wssEd = `wss://ws.coincap.io/trades/binance`;

            const ws: any = new WebSocket(wssEd)
            ws.on('open', () => {
                this.logger.log('Connection established')
            })
            ws.onmessage = (msg: any) => {
                const message = JSON.parse(msg.data)
                observer.next(message)
            }
            ws.on('close', () => {
                this.logger.log('Connection closed')
            })
        })
        return stream$
    }

    afterInit(server: Server): any {
        this.logger.log("Initial EventsGateway");
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(client.id);

    }

    handleDisconnect(client: Socket): any {
        this.logger.log(client.id);

    }

}
