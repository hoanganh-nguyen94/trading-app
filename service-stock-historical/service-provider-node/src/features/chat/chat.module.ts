import {Logger, Module} from '@nestjs/common';
import {ChatGateway} from "./chat.gateway";
import {QuoteModule} from "../quote/quote.module";
import {QuoteService} from "../quote/quote.service";
import {ChatService} from "./chat.service";

@Module({
    providers: [ChatGateway, ChatService, Logger],
    // imports: [QuoteModule]
})
export class ChatModule {
}
