import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from "@nestjs/common";
import {instrument} from "@socket.io/admin-ui";

@WebSocketGateway({
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
})
export class TempGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('TempGateway');

    constructor() {
    }

    @WebSocketServer()
    server: Server;

    afterInit(server: Server): any {

        instrument(this.server, {
            auth: false,
            // namespaceName: "events",
            mode: "development",
        });
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.debug(client.id);

    }

    handleDisconnect(client: Socket): any {
        this.logger.debug(client.id);

    }

}
