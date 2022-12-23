import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteResolver } from './quote.resolver';

@Module({
  providers: [QuoteResolver, QuoteService]
})
export class QuoteModule {}
