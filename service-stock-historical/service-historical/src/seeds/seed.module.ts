import {Logger, Module} from '@nestjs/common';
import {QuoteModule} from "../features/quote/quote.module";
import {SeederService} from "./seed.service";
import {AppModule} from "../app.module";
import {QuoteService} from "../features/quote/quote.service";

@Module({
  imports: [AppModule ,QuoteModule ],
  providers: [ Logger , SeederService , QuoteService]
})
export class SeedModule {}
