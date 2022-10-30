import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {CACHE_MANAGER, Inject, Logger, OnModuleInit} from "@nestjs/common";
import {Server, Socket} from 'socket.io';
import {Cache} from 'cache-manager';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat'
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('EventsGateway');

    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: any): boolean {
        return this.server.to(payload.room).emit('msgToClient', payload);
    }

    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, room: string): void {
        client.join(room);
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(client: Socket, room: string): void {
        client.leave(room);
        client.emit('leftRoom', room);
    }


    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.server.emit('msgToClient', {
            name: `admin`,
            text: `join chat.`,
        });
        this.logger.log(`Client connected: ${client.id}`);
    }
}
