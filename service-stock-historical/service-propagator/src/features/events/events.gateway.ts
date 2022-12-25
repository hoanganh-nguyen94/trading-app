import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Server, Socket} from 'socket.io';
import {Logger} from "@nestjs/common";
import {instrument} from "@socket.io/admin-ui";

@WebSocketGateway({
    namespace: 'events',
    cors: {
        origin: "*",
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('EventsGateway');

    constructor() {
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    findAll(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket): Observable<WsResponse<number>> {
        this.logger.log("events", data);
        this.logger.log(client.id)
        return from([1, 2, 3]).pipe(map(item => ({event: 'events', data: item})));
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }

    afterInit(server: Server): any {
        this.logger.debug(server);

        // instrument(server, {
        //     auth: false,
        //     namespaceName: "events",
        //     mode: "development",
        // });
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.debug(client.id);

    }

    handleDisconnect(client: Socket): any {
        this.logger.debug(client.id);

    }

}
