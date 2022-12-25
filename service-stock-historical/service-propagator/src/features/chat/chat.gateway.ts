import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {instrument} from "@socket.io/admin-ui";


@WebSocketGateway({
    // namespace: 'chat',

    cors: {
        // origin: '*',
        origin: ["https://admin.socket.io"],
        credentials: true
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('ChatGateway');
    constructor(
        private readonly chatService: ChatService
    ) {
    }

    @SubscribeMessage('send_message')
    async listenForMessages(@MessageBody() content: string,
                            @ConnectedSocket() socket: Socket,) {
        this.server.sockets.emit('receive_message', content);
        return await this.chatService.saveMessage(content);
    }

    @SubscribeMessage('request_all_messages')
    async requestAllMessages(
        @ConnectedSocket() socket: Socket,
    ) {
        const messages = await this.chatService.getAllMessages();

        socket.emit('send_all_messages', messages);
    }

    afterInit(server: Socket): any {
        // instrument(this.server, {
        //     auth: false,
        //     mode: "development",
        // });
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(client.id, 'Connected..............................');

        this.logger.debug('handleConnection called  with    client  and args', client);
    }

    handleDisconnect(client: Socket): any {
    }

}

