import { Injectable } from '@nestjs/common';
import { CreateQuoteInput } from './dto/create-quote.input';
import { UpdateQuoteInput } from './dto/update-quote.input';

@Injectable()
export class QuoteService {
  create(createQuoteInput: CreateQuoteInput) {
    return 'This action adds a new quote';
  }

  findAll() {
    return `This action returns all quote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quote`;
  }

  update(id: number, updateQuoteInput: UpdateQuoteInput) {
    return `This action updates a #${id} quote`;
  }

  remove(id: number) {
    return `This action removes a #${id} quote`;
  }
}
