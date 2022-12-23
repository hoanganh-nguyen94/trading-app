import {Logger, Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteResolver } from './quote.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Quote} from "./entities/quote.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QuoteResolver, QuoteService , Logger]
})
export class QuoteModule {}
