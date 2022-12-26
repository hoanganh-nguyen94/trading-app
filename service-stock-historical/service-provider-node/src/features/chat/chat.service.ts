import {Injectable, Logger} from '@nestjs/common';
import {Socket} from 'socket.io';
import {QuoteService} from "../quote/quote.service";

@Injectable()
export class ChatService {
    private logger: Logger = new Logger('ChatService');

    constructor(
        // private quoteService: QuoteService
    ) {
    }

    async getUserFromSocket(socket: Socket) {
        this.logger.debug(socket)
        const cookie = socket.handshake.headers.cookie;
        return {name: "anonymous"};
    }

    async saveMessage(content: string) {
        // return await this.quoteService.create({name:content});
        return content;
    }

    async getAllMessages() {
        // return await this.quoteService.findAll()
        return []

    }
}
