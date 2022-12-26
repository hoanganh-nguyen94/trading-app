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
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('EventsGateway');

    constructor() {
    }


    @SubscribeMessage('events')
    handleEvent(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket): any {
        this.logger.log("events");
        this.logger.log(client.id);
        this.server.emit('events', data)
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
